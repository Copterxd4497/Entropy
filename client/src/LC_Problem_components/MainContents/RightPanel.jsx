import { useState, useRef, useCallback } from "react";
import CodeEditor from "../SubContents/CodeEditor";
import TestPanel from "../SubContents/TestPanel";

export default function RightPanel({ output, lang, setLang, codes, setCodes }) {
  const [editorPct, setEditorPct] = useState(62);
  const dragging = useRef(false);
  const [panelMode, setPanelMode] = useState("test");

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const container = e.currentTarget.parentElement;

    const onMove = (ev) => {
      if (!dragging.current) return;
      const rect = container.getBoundingClientRect();
      const pct = ((ev.clientY - rect.top) / rect.height) * 100;
      setEditorPct(Math.min(85, Math.max(30, pct)));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  return (
    <div className="right-panel">
      <div
        style={{
          height: `${editorPct}%`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <CodeEditor
          lang={lang}
          setLang={setLang}
          codes={codes}
          setCodes={setCodes}
        />
      </div>

      <div
        onMouseDown={onMouseDown}
        style={{
          height: "5px",
          background: "var(--border-soft)",
          cursor: "row-resize",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
          transition: "background var(--transition)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--accent-bg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--border-soft)")
        }
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <TestPanel output={output} mode={panelMode} setMode={setPanelMode} />
      </div>
    </div>
  );
}
