function formatOutput(result) {
  if (!result) return null;
  if (result.error && !result.stdout) return result.error;
  return result.output ?? "(no output)";
}

export default function TestPanel({ output, mode, setMode }) {
  const text = formatOutput(output);
  const results = Array.isArray(output) ? output : null;
  const passedCount = results?.filter((tc) => tc.pass).length ?? 0;
  const failedCount = results ? results.length - passedCount : 0;

  return (
    <div className="bottom-panel">
      <div className="panel-header">
        <div className="panel-tabs">
          <button
            className={`panel-tab ${mode === "test" ? "active" : ""}`}
            onClick={() => setMode("test")}
          >
            Test Cases
          </button>

          <button
            className={`panel-tab ${mode === "console" ? "active" : ""}`}
            onClick={() => setMode("console")}
          >
            Console
          </button>
        </div>

        {mode === "test" && results?.length > 0 ? (
          <div className="panel-summary">
            <span className="summary-pill success">{passedCount} Passed</span>
            <span className="summary-pill danger">{failedCount} Failed</span>
          </div>
        ) : null}
      </div>

      <div className="bottom-content">
        {mode === "console" ? (
          <div className="console-card">
            <div className="panel-section-title">Console Output</div>
            {!text ? (
              <div className="empty-state">Run your code to see output.</div>
            ) : (
              <pre className="console-output__block">{text}</pre>
            )}
          </div>
        ) : (
          <div className="test-results">
            {!results ? (
              <div className="empty-state">
                Submit your solution to run test cases.
              </div>
            ) : results.length === 0 ? (
              <div className="empty-state">No tests available.</div>
            ) : (
              <>
                <div className="results-header">
                  <div>
                    <span className="panel-section-title">Test Results</span>
                    <span className="results-count">
                      {results.length} case{results.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {results.map((tc, index) => (
                  <div
                    key={index}
                    className={`test-case-card ${tc.pass ? "passed" : "failed"}`}
                  >
                    <div className="test-case-header">
                      <span className="test-case-title">Case {index + 1}</span>
                      <span
                        className={`status-badge ${
                          tc.pass ? "success" : "danger"
                        }`}
                      >
                        {tc.pass ? "Passed" : "Failed"}
                      </span>
                    </div>

                    <div className="test-section">
                      <label>Input</label>
                      <pre>{tc.input}</pre>
                    </div>

                    <div className="test-section">
                      <label>Your Output</label>
                      <pre>{tc.output}</pre>
                    </div>

                    {tc.expected != null && (
                      <div className="test-section">
                        <label>Expected</label>
                        <pre>{tc.expected}</pre>
                      </div>
                    )}

                    {tc.error && (
                      <div className="test-section">
                        <label>Error</label>
                        <pre>{tc.error}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
