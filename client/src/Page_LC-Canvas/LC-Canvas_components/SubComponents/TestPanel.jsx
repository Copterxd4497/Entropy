import { useState } from "react";
import { useProblemContext } from "../../../Page_LC-Problem/context/ProblemContext";

function ManualInputTab({ results, onSubmit, isRunning, isSolved }) {
  const [input, setInput] = useState("");

  return (
    <div style={{ padding: "10px" }}>
      <div className="tc-label">Enter Answer</div>
      <textarea
        className="tc-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your answer here..."
        rows={4}
        disabled={isRunning}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          fontFamily: "var(--f-mono, monospace)",
          fontSize: 12,
          color: isRunning ? "#999" : "var(--tx-1, #eff2f6cc)",
          borderRadius: "4px",
          background: isRunning ? "#2a2a2a" : "var(--bg-raised, #1e1e1e)",
          border: "1px solid var(--border, #2a2a2a)",
          cursor: isRunning ? "not-allowed" : "text",
        }}
      />
      <button
        onClick={() => onSubmit(input)}
        disabled={isRunning}
        style={{
          padding: "8px 16px",
          background: isSolved ? "#00b8a3" : "var(--accent, #ffc01e)",
          color: isSolved ? "#fff" : "#000",
          border: "none",
          borderRadius: "4px",
          cursor: isRunning ? "not-allowed" : "pointer",
          fontWeight: "600",
          opacity: isRunning ? 0.8 : 1,
        }}
      >
        {isRunning ? "Submitting..." : isSolved ? "✓ Submit Again" : "Submit"}
      </button>
    </div>
  );
}

function TestResultTab({ results, isSolved }) {
  if (!results)
    return (
      <div className="result-empty" style={{ padding: "10px" }}>
        Submit your answer to see results
      </div>
    );

  // Use results.isSolved if available, otherwise fall back to context isSolved
  const isCorrect =
    results?.isSolved !== undefined ? results.isSolved : isSolved;

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ marginBottom: 10 }}>
        <span
          style={{
            background: isCorrect ? "#00b8a3" : "#ff375f",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {isCorrect ? "✓ Accepted" : "✗ Wrong Answer"}
        </span>
      </div>
      <div className="result-card">
        <strong>Your Answer:</strong>
        <textarea
          readOnly
          value={results.input}
          rows={2}
          style={{
            width: "100%",
            marginTop: "4px",
            padding: "7px 10px",
            fontFamily: "var(--f-mono, monospace)",
            fontSize: 12,
            color: "var(--tx-1, #eff2f6cc)",
            borderRadius: "4px",
            background: "var(--bg-raised, #1e1e1e)",
            border: "1px solid var(--border, #2a2a2a)",
            marginBottom: "10px",
          }}
        />
        <strong>Status:</strong>
        <div
          style={{
            marginTop: "4px",
            padding: "7px 10px",
            fontFamily: "var(--f-mono, monospace)",
            fontSize: 12,
            color: isCorrect ? "#00b8a3" : "#ff375f",
            borderRadius: "4px",
            background: "var(--bg-raised, #1e1e1e)",
            border: "1px solid var(--border, #2a2a2a)",
          }}
        >
          {results.output}
        </div>
      </div>
    </div>
  );
}

export default function TestPanel({ results, onSubmit, isRunning }) {
  const [active, setActive] = useState("input");
  const { problem } = useProblemContext();
  const isSolved = problem?.solved || false;

  return (
    <div className="bottom-panel">
      <div className="bottom-tabs">
        {[
          { id: "input", icon: "⌨", label: "Input" },
          { id: "output", icon: ">_", label: "Output" },
        ].map((t) => (
          <button
            key={t.id}
            className={`btab${active === t.id ? " btab--active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            <span className="btab__icon">{t.icon}</span>
            <span className="btab__lbl">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="bottom-content">
        {active === "input" && (
          <ManualInputTab
            results={results}
            onSubmit={onSubmit}
            isRunning={isRunning}
            isSolved={isSolved}
          />
        )}
        {active === "output" && (
          <TestResultTab results={results} isSolved={isSolved} />
        )}
      </div>
    </div>
  );
}
