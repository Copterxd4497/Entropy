export const TOOLS = [
  { id: "pen", label: "Pen", icon: "✏️" },
  { id: "line", label: "Line", icon: "─" },
  { id: "arrow", label: "Arrow", icon: "➤" },
  { id: "rect", label: "Rect", icon: "▭" },
  { id: "ellipse", label: "Ellipse", icon: "◯" },
  { id: "node", label: "Node", icon: "●" },
  { id: "text", label: "Text", icon: "T" },
  { id: "eraser", label: "Eraser", icon: "⌫" },
  { id: "select", label: "Select", icon: "◧" },
];

export const COLORS = [
  "#ffffff",
  "#ffd166",
  "#ef476f",
  "#06d6a0",
  "#118ab2",
  "#073b4c",
];

export const STROKE_WIDTHS = [1, 2, 4, 6, 8, 12];

// Evaluate simple math expressions safely-ish. Returns number or null on error.
export function evalMath(expr) {
  if (!expr || typeof expr !== "string") return null;
  try {
    // Basic safety: disallow letters to prevent arbitrary code execution
    if (/[a-zA-Z]/.test(expr)) return null;
    // Allow only digits, operators, parentheses, decimal point, spaces
    if (!/^[0-9+\-*/().\s%^]*$/.test(expr)) return null;
    // Replace ^ with ** for exponent
    const safe = expr.replace(/\^/g, "**");
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${safe});`);
    const res = fn();
    if (typeof res === "number" && Number.isFinite(res)) return res;
    return null;
  } catch (e) {
    return null;
  }
}
