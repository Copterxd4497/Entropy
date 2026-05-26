import { useState } from "react";

import BannerStrip from "../SubComponents/BannerStrip";
import TopicTags from "../SubComponents/TopicTags";
import FilterTabs from "../SubComponents/FilterTabs";
import ProblemTable from "../SubComponents/ProblemTable";

export default function CenterContent({ globalSearch }) {
  const [activeTab, setActiveTab] = useState("All Topics");
  const [activeTags, setActiveTags] = useState([]);
  const [tableSearch, setTableSearch] = useState("");

  // Sync global search bar → table search
  const combinedSearch = globalSearch || tableSearch;
  return (
    <main className="main">
      <BannerStrip />

      <TopicTags activeTags={activeTags} setActiveTags={setActiveTags} />
      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProblemTable
        search={combinedSearch}
        setSearch={setTableSearch}
        activeTags={activeTags}
      />
    </main>
  );
}
