const TODAY = 22;
const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const weekDays = ["w1", "w2", "w3", "w4", "w5"];

export default function CalendarWidget() {
  return (
    <div className="panel-card">
      {/* Header */}
      <div className="calendar__header">
        <span style={{ color: "#eff2f699", fontSize: "12px" }}>
          Day <span className="calendar__day-label">{TODAY}</span>
        </span>
        <span className="calendar__time">05:36:02 left</span>
      </div>

      {/* Day-of-week labels */}
      <div className="calendar__grid" style={{ marginBottom: "4px" }}>
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={i} className="calendar__dow">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="calendar__grid">
        {calendarDays.map(d => (
          <div
            key={d}
            className="calendar__cell"
            style={{
              background: d === TODAY ? "#ffc01e" : d < TODAY ? "#2a3a2a" : "transparent",
              color:      d === TODAY ? "#1a1a1a" : d < TODAY ? "#00b8a3" : "#555",
              fontWeight: d === TODAY ? 700 : 400,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Weekly premium */}
      <div className="calendar__weekly">
        <div className="calendar__weekly-header">
          <span className="calendar__weekly-label">Weekly Premium</span>
          <span style={{ color: "#555", fontSize: "11px" }}>6 days left</span>
        </div>
        <div className="calendar__weekly-days">
          {weekDays.map((w, i) => (
            <div
              key={w}
              className="week-day"
              style={{
                background: i === 3 ? "#ffc01e" : i < 3 ? "#ffc01e55" : "#333",
                color:      i === 3 ? "#1a1a1a" : i < 3 ? "#ffc01e"   : "#555",
                fontWeight: i === 3 ? 700 : 400,
              }}
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
