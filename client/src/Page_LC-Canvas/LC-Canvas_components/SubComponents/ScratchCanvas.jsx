import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { TOOLS, COLORS, STROKE_WIDTHS } from "../utils/canvasTools";
import "../../../styles/LC-Canvas_styles/scratchCanvas.css";

/* ──────────────────────────────────────────────
   Tiny sub-components
────────────────────────────────────────────── */
function ToolPalette({ active, setActive, zoom, onZoomIn, onZoomOut, onReset }) {
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
      <div className="tool-palette__divider" />
      <button className="tool-btn" onClick={onZoomIn} title="Zoom in">
        ＋
        <span className="tool-btn__tip">Zoom in</span>
      </button>
      <button className="tool-btn" onClick={onZoomOut} title="Zoom out">
        −
        <span className="tool-btn__tip">Zoom out</span>
      </button>
      <button className="tool-btn tool-btn--zoom" onClick={onReset} title="Reset zoom">
        {Math.round(zoom * 100)}%
        <span className="tool-btn__tip">Reset zoom</span>
      </button>
    </div>
  );
}

function OptionsBar({ color, setColor, strokeWidth, setStrokeWidth, tool }) {
  const showStroke = tool === "pen";
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
  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const startPt = useRef({ x: 0, y: 0 });
  const curPts = useRef([]);

  // Preview element (while drawing)
  const [preview, setPreview] = useState(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    drawGrid(ctx, cv.width / zoom, cv.height / zoom, { x: 0, y: 0 });
    drawAll(ctx, elements, preview);
    ctx.restore();
  }, [elements, preview, offset, zoom]);

  useEffect(() => {
    repaint();
  }, [repaint]);

  /* Coordinate helpers */
  const toCanvas = useCallback((e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - r.left - offset.x) / zoom,
      y: (e.clientY - r.top - offset.y) / zoom,
    };
  }, [offset, zoom]);

  const setZoomAt = useCallback(
    (nextZoom, point) => {
      const clampedZoom = Math.min(3, Math.max(0.5, nextZoom));
      setOffset((previousOffset) => ({
        x: point.x - (point.x - previousOffset.x) * (clampedZoom / zoom),
        y: point.y - (point.y - previousOffset.y) * (clampedZoom / zoom),
      }));
      setZoom(clampedZoom);
    },
    [zoom],
  );

  const onWheel = useCallback(
    (e) => {
      // Navigation is intentionally tied to Select so the drawing tools stay
      // focused on drawing instead of unexpectedly moving the canvas.
      if (tool !== "select") return;
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      if (e.ctrlKey || e.metaKey) {
        setZoomAt(zoom * (e.deltaY < 0 ? 1.1 : 0.9), point);
        return;
      }

      setOffset((previousOffset) => ({
        x: previousOffset.x - e.deltaX,
        y: previousOffset.y - e.deltaY,
      }));
    },
    [setZoomAt, tool, zoom],
  );

  /* ── Pointer events ── */
  const onPointerDown = useCallback(
    (e) => {
      canvasRef.current.setPointerCapture(e.pointerId);

      if (tool === "select") {
        panning.current = true;
        panStart.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const pt = toCanvas(e);

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
    [tool, toCanvas],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (tool === "select" && panning.current) {
        const deltaX = e.clientX - panStart.current.x;
        const deltaY = e.clientY - panStart.current.y;
        panStart.current = { x: e.clientX, y: e.clientY };
        setOffset((previousOffset) => ({
          x: previousOffset.x + deltaX,
          y: previousOffset.y + deltaY,
        }));
        return;
      }

      if (!drawing.current) return;
      const pt = toCanvas(e);
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
    },
    [tool, color, strokeWidth, toCanvas],
  );

  const onPointerUp = useCallback(
    () => {
      if (panning.current) {
        panning.current = false;
        return;
      }
      if (!drawing.current) return;
      drawing.current = false;

      let newEl = null;
      if (tool === "pen")
        newEl = {
          type: "pen",
          pts: [...curPts.current],
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
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (e.key === "p") setTool("pen");
      if (e.key === "x") setTool("eraser");
      if (e.key === "v") setTool("select");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* Cursor style */
  const cursor = tool === "select" ? "grab" : tool === "eraser" ? "cell" : "crosshair";

  return (
    <>
      {/* Canvas header */}
      <div className="canvas-header">
        <div className="canvas-header__title">
          <span className="canvas-header__title-icon">✏️</span>
          <span>Scratchpad</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="canvas-header__badge">Touch drawing enabled</span>
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
      </div>

      {/* Canvas area */}
      <div ref={wrapRef} className="canvas-wrap" style={{ cursor }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
        />

        <ToolPalette
          active={tool}
          setActive={setTool}
          zoom={zoom}
          onZoomIn={() => setZoomAt(zoom + 0.25, { x: 0, y: 0 })}
          onZoomOut={() => setZoomAt(zoom - 0.25, { x: 0, y: 0 })}
          onReset={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
        />
        <OptionsBar
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          tool={tool}
        />
        <ActionButtons onUndo={undo} onRedo={redo} onClear={clear} />

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
            ["V", "select / pan"],
            ["P", "pen"],
            ["X", "erase"],
            ["Wheel", "scroll"],
            ["Ctrl + Wheel", "zoom"],
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
