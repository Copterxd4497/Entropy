import { useState } from "react";
import { problems } from "../../LC_Problem_data/problemsData";

/* ── Tab bar ── */
const TABS = [
  { id: "description", icon: "☐", label: "Description" },
  { id: "editorial", icon: "📖", label: "Editorial" },
  { id: "solutions", icon: "👥", label: "Solutions" },
  { id: "submissions", icon: "📋", label: "Submissions" },
];

function TabBar({ active, setActive }) {
  return (
    <div className="tab-bar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab${active === t.id ? " tab--active" : ""}`}
          onClick={() => setActive(t.id)}
        >
          <span className="tab__icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Rich text paragraph ── */
function RichPara({ parts }) {
  return (
    <p>
      {parts.map((part, i) => {
        let el = part.text;
        if (part.bold) el = <strong key={i}>{el}</strong>;
        if (part.italic) el = <em key={i}>{el}</em>;
        if (part.code) el = <code key={i}>{el}</code>;
        // wrap non-element strings
        if (typeof el === "string") el = <span key={i}>{el}</span>;
        return el;
      })}
    </p>
  );
}

/* ── Example block ── */
function Example({ ex }) {
  return (
    <div className="desc__example">
      <pre>
        <strong>Input:</strong>
        {"  "}
        {ex.input}
        {"\n"}
        <strong>Output:</strong>
        {"  "}
        {ex.output}
        {ex.explanation && (
          <>
            {"\n"}
            <strong>Explanation:</strong>
            {"  "}
            {ex.explanation}
          </>
        )}
      </pre>
    </div>
  );
}

/* ── Footer ── */
function Footer() {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  return (
    <div className="desc__footer">
      <button
        className={`desc__footer-btn${liked ? " desc__footer-btn--active" : ""}`}
        onClick={() => {
          setLiked((v) => !v);
          setDisliked(false);
        }}
      >
        👍 {problems.likes}
      </button>
      <button
        className={`desc__footer-btn${disliked ? " desc__footer-btn--active" : ""}`}
        onClick={() => {
          setDisliked((v) => !v);
          setLiked(false);
        }}
      >
        👎 {problems.dislikes}
      </button>
      <span className="desc__footer-sep">|</span>
      <button className="desc__footer-btn">⭐</button>
      <button className="desc__footer-btn">↗</button>
      <button className="desc__footer-btn">?</button>

      <div className="desc__online">
        <div className="desc__online-dot" />
        {problems.online.toLocaleString()} Online
      </div>
    </div>
  );
}

/* ── Main description content ── */
function DescriptionContent() {
  return (
    <div className="description">
      {/* Title row */}
      <div className="desc__title-row">
        <h1 className="desc__title">
          {problems.id}. {problems.title}
        </h1>
        {problems.solved && (
          <div className="desc__solved">
            <span>Solved</span>
            <span>✅</span>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="desc__badges">
        <span className={`badge badge--${problems.difficulty.toLowerCase()}`}>
          {problems.difficulty}
        </span>
        <button className="badge badge--tag">🏷 Topics</button>
        <button className="badge badge--tag">🏢 Companies</button>
        <button className="badge badge--tag">💡 Hint</button>
      </div>

      {/* Body text */}
      <div className="desc__body">
        {problems.description.map((block, i) => (
          <RichPara key={i} parts={block.parts} />
        ))}

        {/* Examples */}
        {problems.examples.map((ex) => (
          <div key={ex.id}>
            <p className="desc__section-title">Example {ex.id}:</p>
            <Example ex={ex} />
          </div>
        ))}

        {/* Constraints */}
        <p className="desc__section-title">Constraints:</p>
        {problems.constraints.map((c, i) => (
          <div key={i} className="desc__constraint">
            <span className="desc__constraint-dot">•</span>
            <span className="desc__constraint-text">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Placeholder for other tabs ── */
function Placeholder({ label }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-dim)",
        fontSize: "14px",
      }}
    >
      {label} coming soon…
    </div>
  );
}

/* ── Exported component ── */
export default function DescriptionPanel() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="left-panel" style={{ flex: 1 }}>
      <TabBar active={activeTab} setActive={setActiveTab} />

      {activeTab === "description" && <DescriptionContent />}
      {activeTab === "editorial" && <Placeholder label="Editorial" />}
      {activeTab === "solutions" && <Placeholder label="Solutions" />}
      {activeTab === "submissions" && <Placeholder label="Submissions" />}

      <Footer />
    </div>
  );
}
