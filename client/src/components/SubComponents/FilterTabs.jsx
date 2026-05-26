import { tabs } from "../../data/TabsData";

export default function FilterTabs({ activeTab, setActiveTab }) {
  return (
    <div className="filter-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className="filter-tab filter-btn"
          onClick={() => setActiveTab(tab)}
          style={{
            background: activeTab === tab ? "#ffc01e" : "#2a2a2a",
            color: activeTab === tab ? "#1a1a1a" : "#eff2f699",
            fontWeight: activeTab === tab ? 600 : 400,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
