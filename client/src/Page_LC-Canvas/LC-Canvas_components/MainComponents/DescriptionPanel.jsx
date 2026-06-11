import { useState } from "react";
import { useProblemContext } from "../../../Page_LC-Problem/context/ProblemContext";

/* ── Tabs ── */
const TABS = [
  { id: "description", icon: "☐", label: "Description" },
  { id: "editorial", icon: "📖", label: "Editorial" },
  { id: "solutions", icon: "👥", label: "Solutions" },
  { id: "submissions", icon: "📋", label: "Submissions" },
];

function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="tab-bar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab${activeTab === t.id ? " tab--active" : ""}`}
          onClick={() => setActiveTab(t.id)}
        >
          <span className="tab__icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Rich text ── */
function RichPara({ parts }) {
  return (
    <p>
      {parts.map((part, i) => {
        let content = <span key={i}>{part.text}</span>;

        if (part.code) content = <code key={i}>{part.text}</code>;
        if (part.bold) content = <strong key={i}>{part.text}</strong>;
        if (part.italic) content = <em key={i}>{part.text}</em>;

        return content;
      })}
    </p>
  );
}

/* ── Example ── */
function Example({ ex }) {
  return (
    <div className="desc__example">
      <pre>
        <strong>Input:</strong> {ex.input}
        {"\n"}
        <strong>Output:</strong> {ex.output}
        {ex.explanation && (
          <>
            {"\n"}
            <strong>Explanation:</strong> {ex.explanation}
          </>
        )}
      </pre>
    </div>
  );
}

/* ── Footer ── */
function Footer({ problem }) {
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
        👍 {problem?.likes ?? 0}
      </button>

      <button
        className={`desc__footer-btn${disliked ? " desc__footer-btn--active" : ""}`}
        onClick={() => {
          setDisliked((v) => !v);
          setLiked(false);
        }}
      >
        👎 {problem?.dislikes ?? 0}
      </button>

      <span className="desc__footer-sep">|</span>

      <button className="desc__footer-btn">⭐</button>
      <button className="desc__footer-btn">↗</button>
      <button className="desc__footer-btn">?</button>

      <div className="desc__online">
        <div className="desc__online-dot" />
        {problem?.online?.toLocaleString() ?? 0} Online
      </div>
    </div>
  );
}

/* ── Main content ── */
function DescriptionContent({ problem }) {
  if (!problem) return null;

  return (
    <div className="description">
      {/* Title */}
      <div className="desc__title-row">
        <h1 className="desc__title">
          {problem.id}. {problem.title}
        </h1>

        {problem.solved && (
          <div className="desc__solved">
            <span>Solved</span>
            <span>✅</span>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="desc__badges">
        <span className={`badge badge--${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>

        {problem.tags?.map((tag) => (
          <button key={tag} className="badge badge--tag">
            {tag}
          </button>
        ))}

        <button className="badge badge--tag">🏢 Companies</button>
        <button className="badge badge--tag">💡 Hint</button>
      </div>

      {/* Body */}
      <div className="desc__body">
        {problem.description?.map((block, i) => (
          <RichPara key={i} parts={block.parts} />
        ))}

        {/* Examples */}
        {problem.examples?.map((ex) => (
          <div key={ex.id}>
            <p className="desc__section-title">Example {ex.id}:</p>
            <Example ex={ex} />
          </div>
        ))}

        {/* Constraints */}
        <p className="desc__section-title">Constraints:</p>
        {problem.constraints?.map((c, i) => (
          <div key={i} className="desc__constraint">
            <span className="desc__constraint-dot">•</span>
            <span className="desc__constraint-text">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Placeholder ── */
function Placeholder({ label }) {
  return <div className="placeholder">{label} coming soon…</div>;
}

/* ── Main panel ── */
export default function DescriptionPanel() {
  const [activeTab, setActiveTab] = useState("description");
  const { problem } = useProblemContext();

  return (
    <div className="left-panel">
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "description" && <DescriptionContent problem={problem} />}
      {activeTab === "editorial" && <Placeholder label="Editorial" />}
      {activeTab === "solutions" && <Placeholder label="Solutions" />}
      {activeTab === "submissions" && <Placeholder label="Submissions" />}

      <Footer problem={problem} />
    </div>
  );
}
