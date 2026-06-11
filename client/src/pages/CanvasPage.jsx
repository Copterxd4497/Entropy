import { useState } from "react";
import "../styles/LC-Canvas_styles/LC-Canvasglobal.css";

import Toolbar from "../Page_LC-Canvas/LC-Canvas_components/MainComponents/Toolbar";
import DescriptionPanel from "../Page_LC-Canvas/LC-Canvas_components/MainComponents/DescriptionPanel";
import RightPanel from "../Page_LC-Canvas/LC-Canvas_components/MainComponents/RightPanel";
import { ProblemProvider } from "../Page_LC-Problem/context/ProblemContext";
import { problem as defaultProblem } from "../Page_LC-Canvas/LC-Canvas_data/problem";
import { useResizableH } from "../Page_LC-Canvas/hooks/useResizable";

export default function App() {
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

  return (
    <ProblemProvider problem={defaultProblem}>
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
