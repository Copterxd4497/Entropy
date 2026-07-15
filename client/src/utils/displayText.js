export function toPlainText(value) {
  if (typeof value !== "string") return value ?? "";

  let text = value.trim();
  if (!text) return "";

  text = text.replace(/\\left|\\right/g, "");
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)");
  text = text.replace(/\\sin/g, "sin");
  text = text.replace(/\\cos/g, "cos");
  text = text.replace(/\\tan/g, "tan");
  text = text.replace(/\\log/g, "log");
  text = text.replace(/\\lim/g, "lim");
  text = text.replace(/\\pi/g, "pi");
  text = text.replace(/\\to/g, "->");
  text = text.replace(/\\cdot/g, "*");
  text = text.replace(/\\times/g, "*");
  text = text.replace(/\\le/g, "<=");
  text = text.replace(/\\ge/g, ">=");
  text = text.replace(/\\neq/g, "!=");
  text = text.replace(/\\approx/g, "~");
  text = text.replace(/\\infty/g, "infinity");
  text = text.replace(/\\alpha/g, "alpha");
  text = text.replace(/\\beta/g, "beta");
  text = text.replace(/\\gamma/g, "gamma");
  text = text.replace(/\\delta/g, "delta");
  text = text.replace(/\\theta/g, "theta");
  text = text.replace(/\\lambda/g, "lambda");
  text = text.replace(/\\mu/g, "mu");
  text = text.replace(/\\text\{([^{}]+)\}/g, "$1");
  text = text.replace(/\\([A-Za-z]+)/g, "$1");
  text = text.replace(/_/g, " ");
  text = text.replace(/[{}]/g, "");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
