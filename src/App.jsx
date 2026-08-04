import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import LandlingPage from "./components/LandlingPage";
import AboutPage from "./components/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandlingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;