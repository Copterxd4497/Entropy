import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { TOOLS, COLORS, STROKE_WIDTHS, evalMath } from "../utils/canvasTools";
import "../../../styles/LC-Canvas_styles/scratchCanvas.css";

/* ──────────────────────────────────────────────
   Tiny sub-components
────────────────────────────────────────────── */
function ToolPalette({ active, setActive }) {
  return (
    <div className="tool-palette">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          className={`tool-btn${active === t.id ? " tool-btn--active" : ""}`}
          onClick={() => setActive(t.id)}
          title={t.label}
        >
          {t.icon}
          <span className="tool-btn__tip">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function OptionsBar({ color, setColor, strokeWidth, setStrokeWidth, tool }) {
  const showStroke = !["select", "eraser", "text"].includes(tool);
  return (
    <div className="options-bar">
      {COLORS.map((c) => (
        <div
          key={c}
          className={`color-swatch${color === c ? " color-swatch--active" : ""}`}
          style={{ background: c }}
          onClick={() => setColor(c)}
        />
      ))}
      {showStroke && (
        <>
          <div className="options-sep" />
          {STROKE_WIDTHS.map((w) => (
            <div
              key={w}
              className={`stroke-btn${strokeWidth === w ? " stroke-btn--active" : ""}`}
              onClick={() => setStrokeWidth(w)}
              title={`${w}px`}
            >
              <div
                style={{
                  width: 22,
                  height: w,
                  background:
                    strokeWidth === w ? "var(--accent)" : "var(--tx-2)",
                  borderRadius: 1,
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function ActionButtons({ onUndo, onRedo, onClear }) {
  return (
    <div className="canvas-actions">
      <button className="canvas-action-btn" onClick={onUndo}>
        ↩ Undo
      </button>
      <button className="canvas-action-btn" onClick={onRedo}>
        ↪ Redo
      </button>
      <button
        className="canvas-action-btn canvas-action-btn--danger"
        onClick={onClear}
      >
        ✕ Clear
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Canvas rendering helpers
────────────────────────────────────────────── */
const FONT = "14px 'DM Mono', monospace";

function drawGrid(ctx, w, h, offset) {
  const step = 28;
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  const ox = ((offset.x % step) + step) % step;
  const oy = ((offset.y % step) + step) % step;
  for (let x = ox; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = oy; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawShape(ctx, el) {
  ctx.save();
  ctx.strokeStyle = el.color;
  ctx.fillStyle = el.color;
  ctx.lineWidth = el.sw;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (el.type) {
    case "pen":
      if (el.pts.length < 2) break;
      ctx.beginPath();
      ctx.moveTo(el.pts[0].x, el.pts[0].y);
      for (let i = 1; i < el.pts.length; i++)
        ctx.lineTo(el.pts[i].x, el.pts[i].y);
      ctx.stroke();
      break;

    case "line":
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
      break;

    case "arrow": {
      const dx = el.x2 - el.x1,
        dy = el.y2 - el.y1;
      const len = Math.hypot(dx, dy);
      if (len < 2) break;
      const ux = dx / len,
        uy = dy / len;
      const hs = Math.min(16 + el.sw * 2, len * 0.4);
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(el.x2, el.y2);
      ctx.lineTo(
        el.x2 - ux * hs + uy * hs * 0.4,
        el.y2 - uy * hs - ux * hs * 0.4,
      );
      ctx.lineTo(
        el.x2 - ux * hs - uy * hs * 0.4,
        el.y2 - uy * hs + ux * hs * 0.4,
      );
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "rect":
      ctx.strokeRect(el.x, el.y, el.w, el.h);
      break;

    case "ellipse":
      ctx.beginPath();
      ctx.ellipse(
        el.x + el.w / 2,
        el.y + el.h / 2,
        Math.abs(el.w / 2),
        Math.abs(el.h / 2),
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      break;

    case "node": {
      const r = 24;
      ctx.beginPath();
      ctx.arc(el.cx, el.cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.sw;
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fill();
      // label
      ctx.fillStyle = el.color;
      ctx.font = `600 13px 'DM Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(el.label, el.cx, el.cy);
      break;
    }

    case "text":
      ctx.font = `${el.fontSize || 15}px 'DM Mono', monospace`;
      ctx.fillStyle = el.color;
      ctx.textBaseline = "top";
      // Render each line
      (el.lines || [el.text]).forEach((line, i) => {
        ctx.fillText(line, el.x, el.y + i * (el.fontSize || 15) * 1.4);
      });
      // Show math result if any
      if (el.mathResult !== undefined && el.mathResult !== null) {
        ctx.font = "600 13px 'DM Mono', monospace";
        ctx.fillStyle = "var(--accent, #ffa116)";
        const lines = el.lines || [el.text];
        const ry = el.y + lines.length * (el.fontSize || 15) * 1.4 + 4;
        ctx.fillText(`= ${el.mathResult}`, el.x, ry);
      }
      break;

    default:
      break;
  }
  ctx.restore();
}

function drawAll(ctx, elements, previewEl) {
  elements.forEach((el) => drawShape(ctx, el));
  if (previewEl) drawShape(ctx, previewEl);
}

/* ──────────────────────────────────────────────
   Text editing overlay
────────────────────────────────────────────── */
function TextOverlay({ x, y, onCommit, color, fontSize = 15 }) {
  const [val, setVal] = useState("");
  const taRef = useRef(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  const commit = useCallback(() => {
    if (val.trim()) onCommit(val);
    else onCommit(null);
  }, [val, onCommit]);

  const handleKey = (e) => {
    if (e.key === "Escape") {
      onCommit(null);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commit();
    }
  };

  return (
    <textarea
      ref={taRef}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKey}
      style={{
        position: "absolute",
        left: x,
        top: y,
        minWidth: 120,
        minHeight: 36,
        background: "rgba(24,27,34,0.92)",
        border: "1.5px solid var(--accent-ring, #ffa116)",
        borderRadius: 4,
        color: color || "#eceef2",
        fontFamily: "'DM Mono', monospace",
        fontSize: fontSize,
        lineHeight: 1.5,
        padding: "4px 8px",
        resize: "none",
        outline: "none",
        zIndex: 30,
        caretColor: "#ffa116",
      }}
    />
  );
}

/* ──────────────────────────────────────────────
   Main ScratchCanvas
────────────────────────────────────────────── */
export default function ScratchCanvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Element history
  const [elements, setElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  // Active drawing state
  const drawing = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });
  const curPts = useRef([]);

  // Preview element (while drawing)
  const [preview, setPreview] = useState(null);

  // Canvas pan offset
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Text input overlay
  const [textInput, setTextInput] = useState(null); // { x, y }

  // Node counter
  const nodeLabel = useRef(0);

  /* Size canvas to wrapper */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    const cv = canvasRef.current;
    if (!el || !cv) return;
    const ro = new ResizeObserver(() => {
      cv.width = el.clientWidth;
      cv.height = el.clientHeight;
      repaint();
    });
    ro.observe(el);
    cv.width = el.clientWidth;
    cv.height = el.clientHeight;
    return () => ro.disconnect();
  }, []);

  /* Full repaint */
  const repaint = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    drawGrid(ctx, cv.width, cv.height, offset);
    ctx.save();
    drawAll(ctx, elements, preview);
    ctx.restore();
  }, [elements, preview, offset]);

  useEffect(() => {
    repaint();
  }, [repaint]);

  /* Coordinate helpers */
  const toCanvas = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /* ── Pointer events ── */
  const onPointerDown = useCallback(
    (e) => {
      if (textInput) return;
      const pt = toCanvas(e);
      canvasRef.current.setPointerCapture(e.pointerId);

      // Middle mouse / space+drag → pan
      if (e.button === 1 || (e.button === 0 && tool === "select")) {
        panning.current = true;
        panStart.current = {
          x: e.clientX,
          y: e.clientY,
          ox: offset.x,
          oy: offset.y,
        };
        return;
      }

      if (tool === "text") {
        setTextInput(pt);
        return;
      }

      if (tool === "eraser") {
        eraseAt(pt);
        drawing.current = true;
        startPt.current = pt;
        return;
      }

      drawing.current = true;
      startPt.current = pt;
      curPts.current = [pt];
    },
    [tool, offset, textInput],
  );

  const onPointerMove = useCallback(
    (e) => {
      const pt = toCanvas(e);

      if (panning.current) {
        setOffset({
          x: panStart.current.ox + (e.clientX - panStart.current.x),
          y: panStart.current.oy + (e.clientY - panStart.current.y),
        });
        return;
      }

      if (!drawing.current) return;
      const s = startPt.current;

      if (tool === "eraser") {
        eraseAt(pt);
        return;
      }
      if (tool === "pen") {
        curPts.current.push(pt);
        setPreview({
          type: "pen",
          pts: [...curPts.current],
          color,
          sw: strokeWidth,
        });
        return;
      }
      if (tool === "line") {
        setPreview({
          type: "line",
          x1: s.x,
          y1: s.y,
          x2: pt.x,
          y2: pt.y,
          color,
          sw: strokeWidth,
        });
        return;
      }
      if (tool === "arrow") {
        setPreview({
          type: "arrow",
          x1: s.x,
          y1: s.y,
          x2: pt.x,
          y2: pt.y,
          color,
          sw: strokeWidth,
        });
        return;
      }
      if (tool === "rect") {
        setPreview({
          type: "rect",
          x: Math.min(s.x, pt.x),
          y: Math.min(s.y, pt.y),
          w: Math.abs(pt.x - s.x),
          h: Math.abs(pt.y - s.y),
          color,
          sw: strokeWidth,
        });
        return;
      }
      if (tool === "ellipse") {
        setPreview({
          type: "ellipse",
          x: Math.min(s.x, pt.x),
          y: Math.min(s.y, pt.y),
          w: pt.x - s.x,
          h: pt.y - s.y,
          color,
          sw: strokeWidth,
        });
        return;
      }
    },
    [tool, color, strokeWidth],
  );

  const onPointerUp = useCallback(
    (e) => {
      panning.current = false;
      if (!drawing.current) return;
      drawing.current = false;

      const pt = toCanvas(e);
      const s = startPt.current;

      let newEl = null;
      if (tool === "pen")
        newEl = {
          type: "pen",
          pts: [...curPts.current],
          color,
          sw: strokeWidth,
          id: Date.now(),
        };
      if (tool === "line")
        newEl = {
          type: "line",
          x1: s.x,
          y1: s.y,
          x2: pt.x,
          y2: pt.y,
          color,
          sw: strokeWidth,
          id: Date.now(),
        };
      if (tool === "arrow")
        newEl = {
          type: "arrow",
          x1: s.x,
          y1: s.y,
          x2: pt.x,
          y2: pt.y,
          color,
          sw: strokeWidth,
          id: Date.now(),
        };
      if (tool === "rect")
        newEl = {
          type: "rect",
          x: Math.min(s.x, pt.x),
          y: Math.min(s.y, pt.y),
          w: Math.abs(pt.x - s.x),
          h: Math.abs(pt.y - s.y),
          color,
          sw: strokeWidth,
          id: Date.now(),
        };
      if (tool === "ellipse")
        newEl = {
          type: "ellipse",
          x: Math.min(s.x, pt.x),
          y: Math.min(s.y, pt.y),
          w: pt.x - s.x,
          h: pt.y - s.y,
          color,
          sw: strokeWidth,
          id: Date.now(),
        };
      if (tool === "node")
        newEl = {
          type: "node",
          cx: pt.x,
          cy: pt.y,
          label: String(++nodeLabel.current),
          color,
          sw: strokeWidth,
          id: Date.now(),
        };

      if (newEl) {
        setUndoStack((u) => [...u, elements]);
        setElements((prev) => [...prev, newEl]);
      }
      setPreview(null);
    },
    [tool, color, strokeWidth, elements],
  );

  /* Eraser */
  const eraseAt = (pt) => {
    setElements((prev) =>
      prev.filter((el) => {
        if (el.type === "pen")
          return !el.pts.some((p) => Math.hypot(p.x - pt.x, p.y - pt.y) < 12);
        if (el.type === "node")
          return Math.hypot(el.cx - pt.x, el.cy - pt.y) > 28;
        return true;
      }),
    );
  };

  /* Text commit */
  const commitText = useCallback(
    (val) => {
      setTextInput(null);
      if (!val) return;
      const lines = val.split("\n");
      // Try math on each line
      const mathResult = evalMath(
        lines[lines.length - 1].replace(/=\s*$/, "").trim(),
      );
      const newEl = {
        type: "text",
        x: textInput.x,
        y: textInput.y,
        text: val,
        lines,
        color,
        fontSize: 14,
        mathResult,
        id: Date.now(),
      };
      setUndoStack((u) => [...u, elements]);
      setElements((prev) => [...prev, newEl]);
    },
    [textInput, color, elements],
  );

  /* Undo / Redo / Clear */
  const undo = () => {
    if (!undoStack.length) return;
    setElements(undoStack[undoStack.length - 1]);
    setUndoStack((u) => u.slice(0, -1));
  };
  const redo = () => {}; // simplified – could implement redo stack
  const clear = () => {
    setUndoStack((u) => [...u, elements]);
    setElements([]);
  };

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (e.key === "v") setTool("select");
      if (e.key === "p") setTool("pen");
      if (e.key === "l") setTool("line");
      if (e.key === "r") setTool("rect");
      if (e.key === "e") setTool("ellipse");
      if (e.key === "a") setTool("arrow");
      if (e.key === "t") setTool("text");
      if (e.key === "n") setTool("node");
      if (e.key === "x") setTool("eraser");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* Cursor style */
  const cursor =
    tool === "pen"
      ? "crosshair"
      : tool === "eraser"
        ? "cell"
        : tool === "text"
          ? "text"
          : tool === "select"
            ? "grab"
            : tool === "node"
              ? "copy"
              : "crosshair";

  return (
    <>
      {/* Canvas header */}
      <div className="canvas-header">
        <div className="canvas-header__title">
          <span className="canvas-header__title-icon">✏️</span>
          <span>Scratchpad</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="canvas-header__badge">Visual Calculator</span>
          <span
            style={{
              fontSize: 11,
              color: "var(--tx-3)",
              fontFamily: "var(--f-mono)",
            }}
          >
            {elements.length} element{elements.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="canvas-header__spacer" />
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            fontSize: 11,
            color: "var(--tx-3)",
          }}
        >
          <span>Tip:</span>
          <code
            style={{
              background: "var(--bg-surface)",
              padding: "1px 6px",
              borderRadius: 3,
              fontFamily: "var(--f-mono)",
            }}
          >
            T
          </code>
          <span>for text &amp; math eval</span>
          <code
            style={{
              background: "var(--bg-surface)",
              padding: "1px 6px",
              borderRadius: 3,
              fontFamily: "var(--f-mono)",
            }}
          >
            N
          </code>
          <span>for nodes</span>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={wrapRef} className="canvas-wrap" style={{ cursor }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />

        <ToolPalette active={tool} setActive={setTool} />
        <OptionsBar
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          tool={tool}
        />
        <ActionButtons onUndo={undo} onRedo={redo} onClear={clear} />

        {/* Text input overlay */}
        {textInput && (
          <TextOverlay
            x={textInput.x}
            y={textInput.y}
            color={color}
            onCommit={commitText}
          />
        )}

        {/* Keyboard shortcut legend */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 10,
            color: "var(--tx-4)",
            fontFamily: "var(--f-mono)",
            pointerEvents: "none",
            opacity: 0.8,
          }}
        >
          {[
            ["V", "select"],
            ["P", "pen"],
            ["L", "line"],
            ["R", "rect"],
            ["E", "ellipse"],
            ["A", "arrow"],
            ["T", "text"],
            ["N", "node"],
            ["X", "erase"],
          ].map(([k, l]) => (
            <span
              key={k}
              style={{ display: "flex", alignItems: "center", gap: 3 }}
            >
              <span
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 3,
                  padding: "0 4px",
                }}
              >
                {k}
              </span>
              <span style={{ color: "var(--tx-3)" }}>{l}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
