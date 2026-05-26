import { useState } from "react";
import { companies } from "../../data/CompaniesData";

export default function CompaniesWidget() {
  const [query, setQuery] = useState("");

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="panel-card">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span className="panel-card__title" style={{ marginBottom: 0 }}>
          Trending Companies
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          <span
            style={{ color: "#555", cursor: "pointer", padding: "2px 6px" }}
          >
            ‹
          </span>
          <span
            style={{ color: "#555", cursor: "pointer", padding: "2px 6px" }}
          >
            ›
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="companies__search">
        <span style={{ color: "#555" }}>⌕</span>
        <input
          className="companies__input"
          placeholder="Search for a company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Pills */}
      <div className="companies__grid">
        {filtered.map((c) => (
          <span key={c.name} className="company-pill">
            {c.name}
            <span className="company-pill__count">{c.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
