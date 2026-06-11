import { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/LC-Canvas_styles/LC-Canvasglobal.css";

import Toolbar from "../Page_LC-Canvas/LC-Canvas_components/MainComponents/Toolbar";
import DescriptionPanel from "../Page_LC-Canvas/LC-Canvas_components/MainComponents/DescriptionPanel";
import RightPanel from "../Page_LC-Canvas/LC-Canvas_components/MainComponents/RightPanel";
import { ProblemProvider } from "../Page_LC-Problem/context/ProblemContext";
import { useProblem } from "../hooks/useProblem";
import { useResizableH } from "../Page_LC-Canvas/hooks/useResizable";

export default function Canvas_Problem() {
  const { type, id } = useParams();
  const normalizedType = type === "canvas" ? "scratch" : type;
  const { problem, loading, error } = useProblem(normalizedType, id);
  const [leftPct, onDividerMouseDown] = useResizableH(41, 22, 68);
  const [results, setResults] = useState(null);

  const handleRun = () => {
    setResults([
      {
        input: "nums=[2,7,11,15], target=9",
        output: "[0,1]",
        expected: "[0,1]",
        pass: true,
      },
      {
        input: "nums=[3,2,4], target=6",
        output: "[1,2]",
        expected: "[1,2]",
        pass: true,
      },
      {
        input: "nums=[3,3], target=6",
        output: "[0,1]",
        expected: "[0,1]",
        pass: true,
      },
    ]);
  };

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
        <Toolbar onRun={handleRun} />

        <div className="body">
          {/* Left: problem description */}
          <div
            style={{
              width: `${leftPct}%`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <DescriptionPanel />
          </div>

          {/* Horizontal drag divider */}
          <div className="divider-h" onMouseDown={onDividerMouseDown} />

          {/* Right: canvas scratchpad + tests */}
          <RightPanel results={results} />
        </div>
      </div>
    </ProblemProvider>
  );
}
