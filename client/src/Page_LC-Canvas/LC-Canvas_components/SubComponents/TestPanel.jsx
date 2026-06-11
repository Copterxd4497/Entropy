import { useState } from "react";
import { problem } from "../../LC-Canvas_data/problem";

function TestcaseTab({ activeCase, setActiveCase }) {
  return (
    <div>
      <div className="tc-cases">
        {problem.testCases.map((_, i) => (
          <button
            key={i}
            className={`tc-case-btn${activeCase === i ? " tc-case-btn--active" : ""}`}
            onClick={() => setActiveCase(i)}
          >
            Case {i + 1}
          </button>
        ))}
      </div>
      <div className="tc-label">Input</div>
      <textarea
        className="tc-input"
        value={problem.testCases[activeCase].input}
        readOnly
        rows={2}
      />
      <div className="tc-label">Expected Output</div>
      <div
        className="tc-input"
        style={{
          padding: "7px 10px",
          fontFamily: "var(--f-mono)",
          fontSize: 12,
          color: "var(--tx-1)",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
        }}
      >
        {problem.testCases[activeCase].expected}
      </div>
    </div>
  );
}

function TestResultTab({ results }) {
  if (!results)
    return <div className="result-empty">You must run your code first</div>;
  const allPass = results.every((r) => r.pass);
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <span
          className={`result-chip result-chip--${allPass ? "pass" : "fail"}`}
        >
          {allPass ? "✓ Accepted" : "✗ Wrong Answer"}
        </span>
        <span style={{ color: "var(--tx-3)", fontSize: 12, marginLeft: 8 }}>
          {results.filter((r) => r.pass).length}/{results.length} testcases
          passed
        </span>
      </div>
      {results.map((r, i) => (
        <div key={i} className="result-card">
          <strong>Case {i + 1}:</strong>{" "}
          <span style={{ color: r.pass ? "var(--green)" : "var(--red)" }}>
            {r.pass ? "✓ Passed" : "✗ Failed"}
          </span>
          {"\n"}
          <strong>Input:</strong> {r.input}
          {"\n"}
          <strong>Output:</strong> {r.output}
          {"\n"}
          <strong>Expected:</strong> {r.expected}
        </div>
      ))}
    </div>
  );
}

export default function TestPanel({ results }) {
  const [active, setActive] = useState("testcase");
  const [activeCase, setActiveCase] = useState(0);

  return (
    <div className="bottom-panel">
      <div className="bottom-tabs">
        {[
          { id: "testcase", icon: "☐", label: "Testcase" },
          { id: "testresult", icon: ">_", label: "Test Result" },
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
        {active === "testcase" && (
          <TestcaseTab activeCase={activeCase} setActiveCase={setActiveCase} />
        )}
        {active === "testresult" && <TestResultTab results={results} />}
      </div>
    </div>
  );
}
