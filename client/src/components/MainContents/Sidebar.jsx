import { sidebarItems, myLists } from "../../data/SidebarData";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {sidebarItems.map((item) => (
        <div key={item.label} className="sidebar__item sidebar-item">
          <span className="sidebar__icon">{item.icon}</span>
          <span className="sidebar__label">{item.label}</span>
          {item.badge && <span className="sidebar__badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sidebar__section">
        <div className="sidebar__section-label">My Lists</div>
        {myLists.map((list) => (
          <div key={list} className="sidebar__list-item sidebar-item">
            <span>📁</span>
            <span style={{ fontSize: "13px" }}>{list}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
