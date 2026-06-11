import { problems } from "../LC_Problem_data/problemsData";

//Pyodide lets Python run inside the browser.
const PYODIDE_VERSION = "0.29.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = import(
      /* @vite-ignore */ `${PYODIDE_CDN}pyodide.mjs`
    ).then(({ loadPyodide }) => loadPyodide({ indexURL: PYODIDE_CDN }));
  }
  return pyodidePromise;
}

export function parseTestInput(input) {
  const numsMatch = input.match(/nums\s*=\s*(\[[^\]]*\])/);
  const targetMatch = input.match(/target\s*=\s*(-?\d+)/);
  if (!numsMatch || !targetMatch) {
    throw new Error("Could not parse test input");
  }
  return {
    nums: JSON.parse(numsMatch[1]),
    target: Number(targetMatch[1]),
  };
}

function tryParseInput(input) {
  if (!input?.trim()) return null;
  try {
    return parseTestInput(input);
  } catch {
    return null;
  }
}

function formatArg(arg) {
  if (typeof arg === "object" && arg !== null) {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}

function createCaptureConsole() {
  const logs = [];
  const capture =
    (prefix) =>
    (...args) => {
      const line = args.map(formatArg).join(" ");
      logs.push(prefix ? `${prefix}${line}` : line);
    };
  return {
    logs,
    console: {
      log: capture(""),
      warn: capture("[warn] "),
      error: capture("[error] "),
      info: capture("[info] "),
      debug: capture("[debug] "),
    },
  };
}

function formatOutput(value) {
  if (value === undefined) return null;
  return JSON.stringify(value);
}

function combineRunResult({ stdout, returnValue, error }) {
  if (error) {
    return {
      stdout: stdout || "",
      returnValue: null,
      output: null,
      error,
      display: stdout ? `${stdout}\n\nRuntime Error: ${error}` : error,
    };
  }

  const parts = [];
  if (stdout) parts.push(stdout);
  if (returnValue != null) {
    parts.push(parts.length ? `Return: ${returnValue}` : returnValue);
  }

  return {
    stdout,
    returnValue,
    output: parts.length ? parts.join("\n\n") : null,
    error: null,
    display: parts.length ? parts.join("\n\n") : "(no output)",
  };
}

function stripTypeScript(code) {
  return code
    .replace(/:\s*[^=;,)\n{]+(?=[,;\)\={])/g, "")
    .replace(/\)\s*:\s*[^({\n]+(?=\s*[{\n])/g, ")");
}

function runJavaScriptCapture(code, parsedInput, isTypeScript) {
  const src = isTypeScript ? stripTypeScript(code) : code;
  const { logs, console: captureConsole } = createCaptureConsole();

  try {
    const runner = new Function(
      "console",
      "nums",
      "target",
      `
      ${src}
      if (nums !== undefined && target !== undefined && typeof twoSum === "function") {
        return twoSum(nums, target);
      }
    `,
    );

    const nums = parsedInput?.nums;
    const target = parsedInput?.target;
    const result = runner(captureConsole, nums, target);
    const returnValue = formatOutput(result);

    return combineRunResult({
      stdout: logs.join("\n"),
      returnValue,
      error: null,
    });
  } catch (err) {
    return combineRunResult({
      stdout: logs.join("\n"),
      returnValue: null,
      error: err.message,
    });
  }
}

async function runPythonCapture(code, parsedInput) {
  let fullCode;

  if (parsedInput) {
    const { nums, target } = parsedInput;
    fullCode = `from typing import List
${code}

import json
sol = Solution()
_result = sol.twoSum(${JSON.stringify(nums)}, ${target})
print(json.dumps(_result))`;
  } else {
    fullCode = code.includes("from typing import")
      ? code
      : `from typing import List\n${code}`;
  }

  try {
    const pyodide = await getPyodide();
    let stdout = "";
    let stderr = "";

    pyodide.setStdout({
      batched: (msg) => {
        stdout += msg;
      },
    });
    pyodide.setStderr({
      batched: (msg) => {
        stderr += msg;
      },
    });

    await pyodide.runPythonAsync(fullCode);

    if (stderr.trim()) {
      const errMsg = stderr.trim();
      return combineRunResult({
        stdout: stdout.trim(),
        returnValue: null,
        error: errMsg,
      });
    }

    const trimmedStdout = stdout.trim();

    if (!parsedInput) {
      return combineRunResult({
        stdout: trimmedStdout,
        returnValue: null,
        error: null,
      });
    }

    const lines = trimmedStdout.split("\n");
    let returnValue = null;
    let printStdout = trimmedStdout;

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1].trim();
      returnValue = lastLine;
      printStdout = lines.slice(0, -1).join("\n").trim();
    }

    return combineRunResult({
      stdout: printStdout,
      returnValue,
      error: null,
    });
  } catch (err) {
    return combineRunResult({
      stdout: "",
      returnValue: null,
      error: err.message || String(err),
    });
  }
}

function runCapture(lang, code, parsedInput) {
  if (lang === "JavaScript")
    return runJavaScriptCapture(code, parsedInput, false);
  if (lang === "TypeScript")
    return runJavaScriptCapture(code, parsedInput, true);
  if (lang === "Python") return runPythonCapture(code, parsedInput);
  throw new Error(
    `${lang} is not supported. Switch to JavaScript, TypeScript, or Python.`,
  );
}

// Normalize return and expected values for comparison
function normalizeValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed === "") return trimmed;
  try {
    const parsed = JSON.parse(trimmed);
    return JSON.stringify(parsed);
  } catch {
    return trimmed;
  }
}

//Compare output to expected answer
function testcaseResult(tc, run) {
  const isError = !!run.error;
  const returnValue = run.returnValue;
  let pass = null;
  if (tc.expected !== "__console__") {
    if (isError || returnValue == null) pass = false;
    else {
      pass = normalizeValue(returnValue) === normalizeValue(tc.expected);
    }
  }

  const outputParts = [];
  if (run.stdout) outputParts.push(run.stdout);
  if (returnValue != null && tc.expected !== "__console__") {
    outputParts.push(returnValue);
  } else if (returnValue != null) {
    outputParts.push(`Return: ${returnValue}`);
  }

  const output = isError
    ? run.display
    : outputParts.length
      ? outputParts.join("\n\n")
      : run.display;

  return {
    input: tc.input,
    stdout: run.stdout,
    returnValue,
    output,
    expected: tc.expected === "__console__" ? null : tc.expected,
    pass,
    error: run.error,
  };
}

export async function executeCode(lang, code, cases = problems[testCases]) {
  const results = [];

  for (const tc of cases) {
    const parsed = tryParseInput(tc.input);
    const run = await runCapture(lang, code, parsed);
    const result = testcaseResult(tc, run);
    results.push(result);
  }

  return results;
}

export async function executeConsole(lang, code) {
  try {
    const run = await runCapture(lang, code, null);

    return {
      stdout: run.stdout,
      returnValue: run.returnValue,
      output: run.display,
      error: run.error,
    };
  } catch (err) {
    return {
      stdout: "",
      returnValue: null,
      output: null,
      error: err.message,
    };
  }
}
