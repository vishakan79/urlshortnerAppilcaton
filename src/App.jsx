import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LandlingPage from "./components/LandlingPage";
import AboutPage from "./components/AboutPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
const Dashboard = lazy(() => import("./components/Dashboard"));
import ProtectedRoute from "./components/ProtectedRoute";
import { api } from "./api";

const Page = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.main>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><LandlingPage /></Page>} />
        <Route path="/about" element={<Page><AboutPage /></Page>} />
        <Route path="/register" element={<Page><RegisterPage /></Page>} />
        <Route path="/login" element={<Page><LoginPage /></Page>} />
        <Route
          path="/dashboard"
          element={<Page><ProtectedRoute><Suspense fallback={<div className="p-8"><div className="skeleton h-64 rounded-2xl max-w-6xl mx-auto" /></div>}><Dashboard /></Suspense></ProtectedRoute></Page>}
        />
        <Route path="*" element={<Page><LandlingPage /></Page>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // wake the free-tier backend up as early as possible
  useEffect(() => {
    api.health();
  }, []);

  return (
    <Router>
      <NavBar />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}

export default App;
