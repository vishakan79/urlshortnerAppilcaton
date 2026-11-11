import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const path = useLocation().pathname;
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  const linkCls = (p) =>
    `relative py-1 transition-colors ${
      path === p ? "text-white font-semibold" : "text-gray-200 hover:text-white"
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
          className="bg-rose-600 hover:bg-rose-500 text-white text-center font-semibold px-5 py-2 rounded-md transition-colors"
        >
          Sign Up
        </Link>
      ) : (
        <button
          onClick={logout}
          className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-5 py-2 rounded-md transition-colors"
        >
          Log Out
        </button>
      )}
    </>
  );

  return (
    <header className="h-16 bg-custom-gradient z-50 sticky top-0 shadow-md">
      <div className="lg:px-14 sm:px-8 px-4 h-full w-full flex items-center justify-between">
        <Link to="/">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="font-bold text-2xl sm:text-3xl text-white italic"
          >
            Linklytics
          </motion.h1>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">{items}</nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="sm:hidden text-white text-3xl"
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
            className="sm:hidden overflow-hidden bg-custom-gradient shadow-lg px-4 flex flex-col gap-4 pb-5 pt-2"
          >
            {items}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
