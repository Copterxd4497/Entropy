import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LC_Problem from "./pages/lc-problem";
import Canvas_Problem from "./pages/CanvasPage";

import Pages from "./pages/Pages";
import SubjectPage from "./pages/Intro/SubjectPage";
import CurrentLevelPage from "./pages/Intro/currentLevelPage";
import DailyLearningPage from "./pages/Intro/DailyLearningPage";

function HomeOrSubjectPage() {
  const onboardingComplete = localStorage.getItem("onboardingComplete");

  return onboardingComplete ? <HomePage /> : <SubjectPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeOrSubjectPage />} />
        <Route path="/subjects" element={<SubjectPage />} />
        <Route path="/intro/current-level" element={<CurrentLevelPage />} />
        <Route path="/intro/daily-learning" element={<DailyLearningPage />} />
        {/*<Route path="/problem/:id" element={<LC_Problem />} />*/}
        <Route path="/problem/:type/:id" element={<Pages />} />
      </Routes>
    </BrowserRouter>
  );
}
