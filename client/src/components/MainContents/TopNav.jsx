import { navItems } from "../../data/TopNavData";

export default function TopNav({
  activeNav,
  setActiveNav,
  globalSearch,
  setGlobalSearch,
}) {
  return (
    <nav className="topnav">
      {/* Logo */}
      <div className="topnav__logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffc01e">
          <path d="M16.5 8.25a.75.75 0 000-1.5H12a.75.75 0 00-.75.75v9a.75.75 0 001.5 0V12h3a.75.75 0 000-1.5h-3V8.25h3.75z" />
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM3.5 12a8.5 8.5 0 1117 0 8.5 8.5 0 01-17 0z"
          />
        </svg>
        <span className="topnav__logo-text">LeetCode</span>
      </div>

      {/* Nav Links */}
      {navItems.map((item) => (
        <div
          key={item}
          className={`topnav__link nav-item${activeNav === item ? " topnav__link--active" : ""}`}
          onClick={() => setActiveNav(item)}
        >
          {item}
        </div>
      ))}

      <div className="topnav__spacer" />

      {/* Search */}
      <div className="topnav__search">
        <span className="topnav__search-icon">⌕</span>
        <input
          className="topnav__search-input search-input"
          placeholder="Search..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      <div className="topnav__premium">Premium</div>
    </nav>
  );
}
