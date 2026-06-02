import { problemTopics } from "../../data/ProblamTableData";
import { DIFFICULTY_COLOR } from "../../data/ProblamTableData";

const tiers = ["Easy", "Medium", "Hard"];

export default function ProgressWidget() {
  return (
    <div className="panel-card">
      <div className="panel-card__title">Your Progress</div>

      {tiers.map((tier) => {
        const total = problemTopics.filter((p) => p.difficulty === tier).length;
        const solved = problemTopics.filter(
          (p) => p.difficulty === tier && p.solved,
        ).length;
        const pct = total > 0 ? (solved / total) * 100 : 0;
        const color = DIFFICULTY_COLOR[tier];

        return (
          <div key={tier} className="progress-bar-wrap">
            <div className="progress-bar-top">
              <span style={{ color, fontSize: "12px" }}>{tier}</span>
              <span style={{ color: "#eff2f666", fontSize: "11px" }}>
                {solved}/{total}
              </span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
