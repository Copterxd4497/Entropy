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
    const normalized = text.replace(/\\\\/g, "\\");
    const html = katex.renderToString(normalized, {
      throwOnError: false,
      displayMode: asBlock,
      output: "html",
    });

    return (
      <span
        style={{
          display: asBlock ? "block" : "inline-block",
          fontSize: asBlock ? "1.35rem" : "1.2rem",
          lineHeight: 1.45,
          whiteSpace: "normal",
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          verticalAlign: "middle",
          padding: asBlock ? "0.2rem 0" : "0.1rem 0",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <>{text}</>;
  }
}
