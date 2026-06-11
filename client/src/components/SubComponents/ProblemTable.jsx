import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DIFFICULTY_COLOR, DIFFICULTY_BG } from "../../data/ProblamTableData";

function ControlsRow({
  search,
  setSearch,
  diffFilter,
  setDiffFilter,
  totalSolved,
  total,
}) {
  const filters = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="controls-row">
      {/* Search */}
      <div className="controls-row__search">
        <span className="controls-row__search-icon">⌕</span>
        <input
          className="controls-row__input search-input"
          placeholder="Search questions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Difficulty filters */}
      {filters.map((f) => (
        <button
          key={f}
          className="diff-filter filter-btn"
          onClick={() => setDiffFilter(f)}
          style={
            diffFilter === f
              ? {
                  background: f === "All" ? "#ffc01e" : DIFFICULTY_BG[f],
                  color: f === "All" ? "#1a1a1a" : DIFFICULTY_COLOR[f],
                  borderColor: f === "All" ? "#ffc01e" : DIFFICULTY_COLOR[f],
                }
              : {}
          }
        >
          {f}
        </button>
      ))}

      {/* Solved counter */}
      <div className="controls-row__solved">
        <div className="controls-row__dot" />
        {totalSolved}/{total} Solved
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  return (
    <span
      className="difficulty-badge"
      style={{
        color: DIFFICULTY_COLOR[difficulty],
        background: DIFFICULTY_BG[difficulty],
      }}
    >
      {difficulty}
    </span>
  );
}

export default function ProblemTable({ search, setSearch, activeTags }) {
  const navigate = useNavigate();
  const [diffFilter, setDiffFilter] = useState("All");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [starred, setStarred] = useState({ 1: true });
  const [problems, setProblems] = useState([]);

  //fetch("http://localhost:5000/api/problems/getProblemTopics")
  useEffect(() => {
    fetch("http://localhost:5000/api/all-problems/get_all-problemTopics")
      .then((res) => res.json())
      .then((data) => setProblems(data?.data ?? data))
      .catch((error) => {
        console.error("Failed to load problem topics:", error);
      });
  }, []);

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "All" || p.difficulty === diffFilter;
    const matchTag =
      !activeTags?.length || activeTags.some((tag) => p.tags.includes(tag));
    return matchSearch && matchDiff && matchTag;
  });

  const totalSolved = problems.filter((p) => p.solved).length;

  return (
    <>
      <ControlsRow
        search={search}
        setSearch={setSearch}
        diffFilter={diffFilter}
        setDiffFilter={setDiffFilter}
        totalSolved={totalSolved}
        total={problems.length}
      />

      <div className="problem-table">
        {/* Header */}
        <div className="problem-table__header">
          <div>#</div>
          <div>Title</div>
          <div style={{ textAlign: "center" }}>Acceptance</div>
          <div style={{ textAlign: "center" }}>Difficulty</div>
          <div style={{ textAlign: "center" }}>Lock</div>
          <div />
        </div>

        {/* Rows */}
        {filtered.map((problem, idx) => (
          <div
            key={`${problem.type || "problem"}-${problem.id}`}
            className="problem-table__row row-hover"
            onMouseEnter={() => setHoveredRow(problem.id)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              background: problem.pinned
                ? "#1e2a3a"
                : idx % 2 === 0
                  ? "#1e1e1e"
                  : "#1a1a1a",
            }}
            onClick={() =>
              navigate(
                `/problem/${
                  problem.type === "scratch" ? "canvas" : "code"
                }/${problem.id}`,
              )
            }
          >
            {/* Status */}
            <div className="problem-table__status">
              {problem.pinned ? (
                <span style={{ color: "#4d9de0", fontSize: "14px" }}>📌</span>
              ) : problem.solved ? (
                <span style={{ color: "#00b8a3", fontSize: "14px" }}>✓</span>
              ) : (
                <span style={{ color: "#333", fontSize: "12px" }}>—</span>
              )}
            </div>

            {/* Title */}
            <div
              className="problem-table__title"
              style={{
                color: hoveredRow === problem.id ? "#ffc01e" : "#eff2f6cc",
              }}
            >
              <span className="problem-table__num">{problem.id}.</span>
              {problem.title}
            </div>

            {/* Acceptance */}
            <div className="problem-table__acceptance">
              {problem.acceptance}
            </div>

            {/* Difficulty */}
            <div className="problem-table__difficulty-cell">
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>

            {/* Lock */}
            <div className="problem-table__lock">🔒</div>

            {/* Star */}
            <div
              className="problem-table__star star-btn"
              onClick={(e) => {
                e.stopPropagation();
                setStarred((s) => ({ ...s, [problem.id]: !s[problem.id] }));
              }}
              style={{ color: starred[problem.id] ? "#ffc01e" : "#444" }}
            >
              ★
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
