import katex from "katex";
import "katex/dist/katex.min.css";

function looksLikeLatex(text) {
  if (typeof text !== "string") return false;

  const trimmed = text.trim();
  if (!trimmed) return false;

  const normalized = trimmed.replace(/\\\\/g, "\\");

  if (
    normalized.startsWith("\\") ||
    normalized.includes("\\frac") ||
    normalized.includes("\\sqrt") ||
    normalized.includes("\\sin") ||
    normalized.includes("\\pi") ||
    normalized.includes("\\lim") ||
    /\\[A-Za-z]+/.test(normalized) ||
    normalized.includes("$") ||
    normalized.includes("\\(") ||
    normalized.includes("\\[")
  ) {
    return true;
  }

  const hasMathOperators = /[=+\-*/^_<>]/.test(normalized);
  const hasDigits = /\d/.test(normalized);
  const hasVariables = /[a-zA-Z]/.test(normalized);
  const hasGreekOrSpecial = /[π∞≤≥≠≈]/.test(normalized);
  const hasMathWords = /\b(sin|cos|tan|log|lim|sqrt|frac|pi)\b/i.test(
    normalized,
  );

  return (
    (hasMathOperators && hasDigits && hasVariables) ||
    hasGreekOrSpecial ||
    hasMathWords
  );
}

function unwrapMathDelimiters(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return { text: trimmed.slice(2, -2).trim(), displayMode: true };
  }

  if (trimmed.startsWith("\\[") && trimmed.endsWith("\\]")) {
    return { text: trimmed.slice(2, -2).trim(), displayMode: true };
  }

  if (trimmed.startsWith("$") && trimmed.endsWith("$")) {
    return { text: trimmed.slice(1, -1).trim(), displayMode: false };
  }

  if (trimmed.startsWith("\\(") && trimmed.endsWith("\\)")) {
    return { text: trimmed.slice(2, -2).trim(), displayMode: false };
  }

  return { text: trimmed, displayMode: false };
}

function renderKatex(text, asBlock, key) {
  const { text: unwrappedText, displayMode } = unwrapMathDelimiters(text);
  const html = katex.renderToString(unwrappedText, {
    throwOnError: false,
    displayMode: asBlock || displayMode,
    output: "html",
  });

  return (
    <span
      key={key}
      style={{
        display: asBlock || displayMode ? "block" : "inline-block",
        fontSize: asBlock || displayMode ? "1.35rem" : "1.2rem",
        lineHeight: 1.45,
        whiteSpace: "normal",
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        verticalAlign: "middle",
        padding: asBlock || displayMode ? "0.2rem 0" : "0.1rem 0",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderInlineMath(text) {
  const normalized = text.replace(/\\\\/g, "\\");
  const delimiterPattern = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([^$]+?)\$/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = delimiterPattern.exec(normalized))) {
    if (match.index > lastIndex) {
      parts.push(normalized.slice(lastIndex, match.index));
    }

    const isDisplay = Boolean(match[1] ?? match[3]);
    const latex = match[1] ?? match[2] ?? match[3] ?? match[4];
    parts.push(renderKatex(latex, isDisplay, `math-${match.index}`));
    lastIndex = delimiterPattern.lastIndex;
  }

  if (lastIndex === 0) return null;
  if (lastIndex < normalized.length) parts.push(normalized.slice(lastIndex));
  return parts;
}

export default function MathText({
  children,
  asBlock = false,
  renderMath = true,
}) {
  const text = typeof children === "string" ? children : "";

  if (!renderMath || !looksLikeLatex(text)) {
    return <>{text}</>;
  }

  try {
    const inlineMath = renderInlineMath(text);
    if (inlineMath) return <>{inlineMath}</>;

    return renderKatex(text.replace(/\\\\/g, "\\"), asBlock, "math");
  } catch {
    return <>{text}</>;
  }
}
