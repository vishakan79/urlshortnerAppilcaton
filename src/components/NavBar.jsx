import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const path = useLocation().pathname;
  // menu is open only for the page it was opened on, so it closes on navigation
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === path;

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  const linkCls = (p) =>
    `relative py-1 transition-colors ${
      path === p ? "text-btnColor font-semibold" : "text-slate-600 hover:text-btnColor"
    }`;

  const items = (
    <>
      <Link className={linkCls("/")} to="/">Home</Link>
      <Link className={linkCls("/about")} to="/about">About</Link>
      {token && <Link className={linkCls("/dashboard")} to="/dashboard">Dashboard</Link>}
      {!token && <Link className={linkCls("/login")} to="/login">Login</Link>}
      {!token ? (
        <Link
          to="/register"
          className="bg-custom-gradient text-white text-center font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Sign Up
        </Link>
      ) : (
        <button
          onClick={logout}
          className="border border-slate-300 text-slate-700 font-semibold px-5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Log Out
        </button>
      )}
    </>
  );

  return (
    <header className="h-16 bg-white/85 backdrop-blur border-b border-slate-200 z-50 sticky top-0">
      <div className="lg:px-14 sm:px-8 px-4 h-full w-full flex items-center justify-between">
        <Link to="/">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="font-extrabold text-2xl sm:text-3xl text-gradient italic"
          >
            Linklytics
          </motion.h1>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">{items}</nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpenAt(open ? null : path)}
          className="sm:hidden text-slate-700 text-3xl"
        >
          {open ? <RxCross2 /> : <IoIosMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden bg-white border-b border-slate-200 shadow-lg px-4 flex flex-col gap-4 pb-5 pt-2"
          >
            {items}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
