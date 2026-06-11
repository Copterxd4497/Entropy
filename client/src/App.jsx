import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LC_Problem from "./pages/lc-problem";
import Canvas_Problem from "./pages/CanvasPage";

import Pages from "./pages/Pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/*<Route path="/problem/:id" element={<LC_Problem />} />*/}
        <Route path="/problem/:type/:id" element={<Pages />} />
      </Routes>
    </BrowserRouter>
  );
}
