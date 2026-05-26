import { useState } from "react";
import "../styles/global.css";

import Sidebar from "../components/MainContents/Sidebar";
import TopNav from "../components/MainContents/TopNav";
import RightPanel from "../components/MainContents/RightPanel";
import CenterContent from "../components/MainContents/CenterContent";

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("Problems");
  const [globalSearch, setGlobalSearch] = useState("");

  return (
    <div className="app-shell">
      <TopNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
      />

      <div className="app-body">
        <Sidebar />

        <CenterContent globalSearch={globalSearch} />

        <RightPanel />
      </div>
    </div>
  );
}
