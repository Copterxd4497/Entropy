import CalendarWidget from "../SubComponents/CalendarWidget";
import CompaniesWidget from "../SubComponents/CompaniesWidget";
import ProgressWidget from "../SubComponents/ProgressWidget";

export default function RightPanel() {
  return (
    <aside className="right-panel">
      <CalendarWidget />
      <CompaniesWidget />
      <ProgressWidget />
    </aside>
  );
}
