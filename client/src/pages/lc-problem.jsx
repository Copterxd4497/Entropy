import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "../styles/lc-problemStyle.css";

//LC_Problem_components
import Toolbar from "../Page_LC-Problem/LC_Problem_components/MainContents/Toolbar";
import DescriptionPanel from "../Page_LC-Problem/LC_Problem_components/MainContents/DescriptionPanel";
import RightPanel from "../Page_LC-Problem/LC_Problem_components/MainContents/RightPanel";

//hooks & context
import { useResizable } from "../hooks/useResizable";
import { useProblem } from "../hooks/useProblem";
import { ProblemProvider } from "../Page_LC-Problem/context/ProblemContext";

//constant & utils
import { codeTemplates } from "../Page_LC-Problem/constant/codeTemplates";
import { executeConsole, executeCode } from "../Page_LC-Problem/utils/runCode";

export default function LC_Problem() {
  const { type, id } = useParams();
  const { problem, loading, error, setProblem } = useProblem(type, id);
  const [leftPct, onDividerMouseDown] = useResizable(36, 20, 50);
  const [lang, setLang] = useState("Python");
  const [codes, setCodes] = useState(codeTemplates);
  const [isRunning, setIsRunning] = useState(false);

  //console, test
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [testResults, setTestResults] = useState(null);

  //handleRun
  const handleRun = useCallback(async () => {
    setIsRunning(true);

    try {
      const result = await executeConsole(lang, codes[lang]);
      setConsoleOutput(result);
    } finally {
      setIsRunning(false);
    }
  }, [lang, codes]);

  //handleSubmit
  const handleSubmit = useCallback(async () => {
    setIsRunning(true);

    try {
      const [consoleResult, testResult] = await Promise.all([
        executeConsole(lang, codes[lang]),
        executeCode(lang, codes[lang], problem?.testCases || []),
      ]);

      // checking if problem is solved
      const isSolved = testResult.length > 0 && testResult.every((t) => t.pass);

      setConsoleOutput(consoleResult);
      setTestResults(testResult);

      const newStatus = isSolved ? "solved" : "attempted";

      if (setProblem) {
        setProblem((prev) =>
          prev ? { ...prev, solved: isSolved, status: newStatus } : prev,
        );
      }

      const statusBasePath =
        type === "scratch" ? "/api/scratchProblems" : "/api/problems";

      await fetch(`${statusBasePath}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
    } finally {
      setIsRunning(false);
    }
  }, [lang, codes, problem?.testCases, id]);

  if (loading) {
    return (
      <div className="app">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Loading problem...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="app">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Problem not found
        </div>
      </div>
    );
  }

  return (
    <ProblemProvider problem={problem} loading={loading} error={error}>
      <div className="app">
        <Toolbar
          onRun={handleRun}
          onSubmit={handleSubmit}
          isRunning={isRunning}
        />

        <div className="body">
          <div
            style={{
              flex: `0 0 ${leftPct}%`,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <DescriptionPanel problem={problem} />
          </div>

          <div className="divider" onMouseDown={onDividerMouseDown} />

          <RightPanel
            consoleOutput={consoleOutput}
            testResults={testResults}
            lang={lang}
            setLang={setLang}
            codes={codes}
            setCodes={setCodes}
          />
        </div>
      </div>
    </ProblemProvider>
  );
}
