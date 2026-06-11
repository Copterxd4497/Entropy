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
  const { problem, loading, error, setProblem } = useProblem(
    normalizedType,
    id,
  );
  const [leftPct, onDividerMouseDown] = useResizableH(41, 22, 68);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = async (input) => {
    // Get expected answer from first test case
    const expectedAnswer =
      problem?.examples?.[0]?.output || problem?.testCases?.[0]?.expected || "";

    // Convert both to strings and normalize by removing whitespace
    const userAnswer = String(input).trim();
    const normalizedExpected = String(expectedAnswer).trim();

    // Check if answer is correct (case-insensitive string comparison)
    const isSolved =
      userAnswer.toLowerCase() === normalizedExpected.toLowerCase();

    // Update results immediately with correct/incorrect message
    setResults({
      input: input,
      output: isSolved ? "Correct!" : "Incorrect!",
      isSolved: isSolved,
    });

    // Update problem context immediately
    if (isSolved && setProblem) {
      setProblem((prev) =>
        prev ? { ...prev, solved: true, status: "solved" } : prev,
      );
    }

    // Send API request in background
    if (isSolved) {
      const statusBasePath = "/api/scratchProblems";
      try {
        await fetch(`${statusBasePath}/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "solved",
          }),
        });
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }
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
        <Toolbar />

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
          <RightPanel
            results={results}
            onSubmit={handleSubmit}
            isRunning={isRunning}
          />
        </div>
      </div>
    </ProblemProvider>
  );
}
