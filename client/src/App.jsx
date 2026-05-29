import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Something from "./pages/something";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={Something} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
