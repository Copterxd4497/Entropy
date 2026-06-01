export default function Toolbar({ onRun, onSubmit, isRunning }) {
  return (
    <div className="toolbar">
      {/* Left */}
      <div className="toolbar__left">
        <div className="toolbar__logo">G</div>
        <button className="toolbar__problem-list">
          <span>☰</span>
          <span>Problem List</span>
        </button>
        <button className="toolbar__nav-btn" title="Previous">
          ‹
        </button>
        <button className="toolbar__nav-btn" title="Next">
          ›
        </button>
        <button className="toolbar__nav-btn" title="Shuffle">
          ⇄
        </button>
      </div>

      {/* Center */}
      <div className="toolbar__center">
        <button className="toolbar__icon-btn" title="Debug">
          🐛
        </button>
        <button
          className="toolbar__run-btn"
          onClick={onRun}
          disabled={isRunning}
        >
          {/* CUTTTTTTTTTTTTT */}
          <span>{isRunning ? "…" : "▶"}</span>
          <span>{isRunning ? "Running" : "Run"}</span>
        </button>

        {/* CUTTTTTTTTTTTTTTT*/}
        <button
          className="toolbar__submit-btn"
          onClick={onSubmit}
          disabled={isRunning}
        >
          <span>☁</span>
          <span>Submit</span>
        </button>
        <button className="toolbar__icon-btn" title="Note">
          ☐
        </button>
        <button className="toolbar__icon-btn" title="More">
          ✦
        </button>
      </div>

      {/* Right */}
      <div className="toolbar__right">
        <button className="toolbar__icon-btn" title="Layout">
          ⊞
        </button>
        <button className="toolbar__icon-btn" title="Settings">
          ⚙
        </button>
        <div className="toolbar__coins">
          <span>🔥</span>
          <span>0</span>
        </div>
        <button className="toolbar__icon-btn" title="Timer">
          ⏱
        </button>
        <button className="toolbar__icon-btn" title="Add Friend">
          👤+
        </button>
        <div className="toolbar__avatar">U</div>
        <div className="toolbar__sep" />
        <div className="toolbar__premium">Premium</div>
      </div>
    </div>
  );
}
