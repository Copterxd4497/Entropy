import ScratchCanvas from "../SubComponents/ScratchCanvas";
import { useResizableV } from "../../hooks/useResizable";

export default function RightPanel() {
  const [editorPct, onDividerMouseDown] = useResizableV(100, 100, 100);

  return (
    <div className="right-panel">
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
    </div>
  );
}
