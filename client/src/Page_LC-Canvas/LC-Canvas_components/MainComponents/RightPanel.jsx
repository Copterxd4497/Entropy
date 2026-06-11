import ScratchCanvas from "../SubComponents/ScratchCanvas";
import TestPanel from "../SubComponents/TestPanel";
import { useResizableV } from "../../hooks/useResizable";

export default function RightPanel({ results }) {
  const [editorPct, onDividerMouseDown] = useResizableV(65, 30, 88);

  return (
    <div className="right-panel">
      {/* Canvas section */}
      <div
        style={{
          height: `${editorPct}%`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ScratchCanvas />
      </div>

      {/* Vertical drag divider */}
      <div className="divider-v" onMouseDown={onDividerMouseDown} />

      {/* Test panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TestPanel results={results} />
      </div>
    </div>
  );
}
