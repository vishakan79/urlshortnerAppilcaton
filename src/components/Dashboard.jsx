import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaCopy, FaCheck, FaExternalLinkAlt, FaMousePointer, FaLink } from "react-icons/fa";
import { api, shortLink } from "../api";
import { useStoreContext } from "../contextApi/ContextApi";
import { inputCls } from "./AuthShell";

const list = { show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

const CopyButton = ({ text }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={copy}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-colors ${done ? "bg-green-600" : "bg-custom-gradient"}`}>
      {done ? <FaCheck /> : <FaCopy />} {done ? "Copied" : "Copy"}
    </motion.button>
  );
};

const Stat = ({ icon, label, value }) => (
  <motion.div variants={item} className="bg-white rounded-xl border border-slate-100 shadow-md shadow-slate-200 p-4 flex items-center gap-4">
    <div className="w-11 h-11 rounded-full bg-indigo-100 text-btnColor flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [latest, setLatest] = useState(null);

  const handleAuthError = useCallback((e) => {
    if (e.status === 401 || e.status === 403) {
      setToken(null);
      navigate("/login");
      return true;
    }
    return false;
  }, [navigate, setToken]);

  const load = useCallback(async () => {
    try {
      setUrls(await api.myUrls(token));
    } catch (e) {
      if (!handleAuthError(e)) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, handleAuthError]);

  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError("Please enter a URL");
    setCreating(true);
    setError("");
    try {
      const created = await api.shorten(url.trim(), token);
      setLatest(created);
      setUrls((u) => [created, ...u]);
      setUrl("");
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0);

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-8 min-h-[calc(100vh-64px)] max-w-6xl mx-auto w-full">
      <motion.h1 initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
        Your Dashboard
      </motion.h1>

      <motion.div variants={list} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <Stat icon={<FaLink />} label="Total links" value={urls.length} />
        <Stat icon={<FaMousePointer />} label="Total clicks" value={totalClicks} />
      </motion.div>

      <motion.form onSubmit={create} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-100 shadow-md shadow-slate-200 p-4 sm:p-6 mb-6">
        <label htmlFor="url" className="font-semibold text-slate-700 block mb-2">Shorten a new link</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/very/long/link"
            inputMode="url" autoComplete="off" className={inputCls} />
          <motion.button whileTap={{ scale: 0.96 }} disabled={creating} type="submit"
            className="bg-custom-gradient text-white font-semibold rounded-md px-6 py-2.5 sm:w-auto w-full whitespace-nowrap disabled:opacity-60">
            {creating ? "Shortening..." : "Shorten"}
          </motion.button>
        </div>
        {error && <p className="text-sm font-semibold text-red-600 mt-3">{error}</p>}

        <AnimatePresence>
          {latest && (
            <motion.div key={latest.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <a href={shortLink(latest.shortnerurl)} target="_blank" rel="noreferrer"
                  className="text-btnColor font-semibold break-all hover:underline">
                  {shortLink(latest.shortnerurl)}
                </a>
                <CopyButton text={shortLink(latest.shortnerurl)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <h2 className="text-lg font-bold text-slate-800 mb-3">My links</h2>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : urls.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
          No links yet. Create your first short link above!
        </motion.p>
      ) : (
        <motion.ul variants={list} initial="hidden" animate="show" className="space-y-3">
          {urls.map((u) => (
            <motion.li key={u.id} variants={item} layout whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-slate-100 shadow-md shadow-slate-200 p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
              <div className="min-w-0">
                <a href={shortLink(u.shortnerurl)} target="_blank" rel="noreferrer"
                  className="text-btnColor font-bold break-all hover:underline flex items-center gap-2">
                  {shortLink(u.shortnerurl)} <FaExternalLinkAlt className="text-xs shrink-0" />
                </a>
                <p className="text-slate-500 text-sm truncate max-w-full md:max-w-xl">{u.originalurl}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {u.createdtime ? new Date(u.createdtime + "Z").toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">{u.clickCount}</p>
                  <p className="text-xs text-slate-500">clicks</p>
                </div>
                <CopyButton text={shortLink(u.shortnerurl)} />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Dashboard;
