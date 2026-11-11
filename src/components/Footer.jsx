import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-6xl mx-auto lg:px-8 px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h2 className="text-white text-xl font-bold italic">Linklytics</h2>
        <p className="text-sm text-slate-400">Simple, fast URL shortening.</p>
      </div>
      <nav className="flex gap-6 text-sm">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/about" className="hover:text-white transition-colors">About</Link>
        <Link to="/login" className="hover:text-white transition-colors">Login</Link>
      </nav>
      <p className="text-xs text-slate-500">&copy; 2026 Linklytics. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
