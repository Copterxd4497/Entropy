export default function Toolbar() {
  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <div className="toolbar__logo">G</div>
        <button className="toolbar__btn">
          <span>☰</span>
          <span>Problem List</span>
        </button>
        <button className="toolbar__icon-btn">‹</button>
        <button className="toolbar__icon-btn">›</button>
        <button className="toolbar__icon-btn">⇄</button>
      </div>

      <div className="toolbar__mid">
        <button className="toolbar__icon-btn" title="Debug">
          🐛
        </button>
        <button className="toolbar__icon-btn" title="Note">
          ☐
        </button>
        <button className="toolbar__icon-btn" title="More">
          ✦
        </button>
      </div>

      <div className="toolbar__right">
        <button className="toolbar__icon-btn" title="Layout">
          ⊞
        </button>
        <button className="toolbar__icon-btn" title="Settings">
          ⚙
        </button>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "var(--tx-3)",
            fontSize: 13,
          }}
        >
          🔥 <span>0</span>
        </span>
        <button className="toolbar__icon-btn" title="Timer">
          ⏱
        </button>
        <button className="toolbar__icon-btn" title="Friend">
          👤+
        </button>
        <div className="toolbar__avatar">U</div>
        <div className="toolbar__sep" />
        <div className="toolbar__premium">Premium</div>
      </div>
    </div>
  );
}
