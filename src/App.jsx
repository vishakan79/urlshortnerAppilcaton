import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import LandlingPage from "./components/LandlingPage";
import AboutPage from "./components/AboutPage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <Router>
    <NavBar />
      <Routes>
        <Route path="/" element={<LandlingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;