import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCopy, FaCheck, FaExternalLinkAlt, FaMousePointer, FaLink, FaChartLine, FaChartPie,
  FaTrashAlt, FaPlus, FaTimes, FaTrophy,
} from "react-icons/fa";
import { api, shortLink } from "../api";
import { useStoreContext } from "../contextApi/ContextApi";
import { inputCls } from "./AuthShell";
import ClicksChart from "./ClicksChart";
import ClicksPie from "./ClicksPie";
import { lastRange } from "../utils/dates";

const RANGES = [7, 30, 90];

const list = { show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

const toCounts = (data) => {
  const out = {};
  if (Array.isArray(data)) data.forEach((d) => { out[d.clickDate] = d.count; });
  else if (data) Object.assign(out, data);
  return out;
};

const RangeTabs = ({ value, onChange }) => (
  <div className="inline-flex bg-slate-100 rounded-lg p-1 text-sm">
    {RANGES.map((r) => (
      <button key={r} onClick={() => onChange(r)}
        className={`px-3 py-1 rounded-md font-semibold transition-colors ${value === r ? "bg-white text-btnColor shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
        {r}d
      </button>
    ))}
  </div>
);

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
    <motion.button whileTap={{ scale: 0.94 }} onClick={copy}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${done ? "bg-green-600" : "bg-btnColor hover:bg-indigo-700"}`}>
      {done ? <FaCheck /> : <FaCopy />} {done ? "Copied" : "Copy"}
    </motion.button>
  );
};

const Stat = ({ icon, label, value }) => (
  <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-btnColor flex items-center justify-center shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </motion.div>
);

/* Loads once on mount. Remount with a new `key` to reload (keeps setState out of the effect body). */
const useClicks = (loader, token, onAuthError) => {
  const [state, setState] = useState({ counts: null, failed: false });
  useEffect(() => {
    let active = true;
    loader()
      .then((data) => active && setState({ counts: toCounts(data), failed: false }))
      .catch((e) => { if (active && !onAuthError(e)) setState({ counts: null, failed: true }); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, onAuthError]);
  return state;
};

const ChartBox = ({ state }) => {
  if (state.failed) return <p className="absolute inset-0 flex items-center justify-center text-sm text-red-500">Could not load analytics.</p>;
  if (!state.counts) return <div className="absolute inset-0 skeleton rounded-xl" />;
  return <ClicksChart counts={state.counts} />;
};

const TotalChart = ({ days, token, onAuthError }) => {
  const [start, end] = lastRange(days);
  const state = useClicks(() => api.totalClicks(start, end, token), token, onAuthError);
  return <ChartBox state={state} />;
};

const LinkAnalytics = ({ code, days, token, onAuthError }) => {
  const [start, end] = lastRange(days);
  const state = useClicks(() => api.analytics(code, start, end, token), token, onAuthError);
  return <ChartBox state={state} />;
};

const CreateModal = ({ onClose, onCreated, token, onAuthError, initialUrl }) => {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError("Please enter a URL");
    setBusy(true);
    setError("");
    try {
      const res = await api.shorten(url.trim(), token);
      setCreated(res);
      onCreated(res);
    } catch (err) {
      if (!onAuthError(err)) setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[60] bg-slate-900/50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose}>
      <motion.div onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Create a New Short URL</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
        </div>

        {created ? (
          <div>
            <p className="text-sm text-slate-500 mb-2">Your short link is ready</p>
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <a href={shortLink(created.shortnerurl)} target="_blank" rel="noreferrer"
                className="text-btnColor font-semibold break-all hover:underline">{shortLink(created.shortnerurl)}</a>
              <CopyButton text={shortLink(created.shortnerurl)} />
            </div>
            <button onClick={onClose} className="mt-5 w-full border border-slate-300 rounded-lg py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="url" className="font-semibold text-sm text-slate-700 block mb-1">Enter your URL</label>
              <input id="url" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" autoComplete="off"
                placeholder="https://example.com/very/long/link" className={inputCls} />
            </div>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <motion.button whileTap={{ scale: 0.97 }} disabled={busy} type="submit"
              className="bg-custom-gradient text-white font-semibold rounded-lg py-2.5 disabled:opacity-60">
              {busy ? "Creating..." : "Create"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useStoreContext();
  const [prefill] = useState(() => location.state?.url || "");

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [chartKey, setChartKey] = useState(0);
  const [showCreate, setShowCreate] = useState(!!prefill);
  const [openId, setOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const handleAuthError = useCallback((e) => {
    if (e.status === 401 || e.status === 403) {
      setToken(null);
      navigate("/login");
      return true;
    }
    return false;
  }, [navigate, setToken]);

  useEffect(() => {
    let active = true;
    api.myUrls(token)
      .then((data) => active && setUrls(data))
      .catch((e) => active && !handleAuthError(e) && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [token, handleAuthError]);

  const onCreated = (created) => {
    setUrls((u) => [created, ...u]);
    setChartKey((k) => k + 1);
  };

  const remove = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 3000);
      return;
    }
    try {
      await api.remove(id, token);
      setUrls((u) => u.filter((x) => x.id !== id));
      setChartKey((k) => k + 1);
      setConfirmId(null);
    } catch (e) {
      if (!handleAuthError(e)) setError(e.message);
    }
  };

  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0);
  const top = urls.reduce((m, u) => (u.clickCount > (m?.clickCount ?? -1) ? u : m), null);

  return (
    <div className="lg:px-8 px-4 py-8 min-h-[calc(100vh-64px)] max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</motion.h1>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowCreate(true)}
          className="bg-custom-gradient text-white font-semibold rounded-lg px-5 py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
          <FaPlus className="text-xs" /> Create a New Short URL
        </motion.button>
      </div>

      <motion.div variants={list} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <Stat icon={<FaLink />} label="Total links" value={urls.length} />
        <Stat icon={<FaMousePointer />} label="Total clicks" value={totalClicks} />
        <Stat icon={<FaTrophy />} label="Top link clicks" value={top ? top.clickCount : 0} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><FaChartLine className="text-btnColor" /> Total clicks</h2>
            <RangeTabs value={days} onChange={setDays} />
          </div>
          <div className="h-72 relative">
            <TotalChart key={`${days}-${chartKey}`} days={days} token={token} onAuthError={handleAuthError} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><FaChartPie className="text-btnColor" /> Clicks by link</h2>
          <div className="h-72 relative">
            {loading ? <div className="absolute inset-0 skeleton rounded-xl" /> : <ClicksPie urls={urls} />}
          </div>
        </motion.section>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-3">My short links</h2>
      {error && <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>}

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : urls.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-600 font-semibold">You have not created any short links yet</p>
          <p className="text-slate-400 text-sm mt-1 mb-4">Create your first one and start tracking clicks.</p>
          <button onClick={() => setShowCreate(true)} className="bg-custom-gradient text-white font-semibold rounded-lg px-5 py-2.5">Create Short URL</button>
        </motion.div>
      ) : (
        <motion.ul variants={list} initial="hidden" animate="show" className="space-y-4">
          {urls.map((u) => {
            const link = shortLink(u.shortnerurl);
            const open = openId === u.id;
            return (
              <motion.li key={u.id} variants={item} layout
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <a href={link} target="_blank" rel="noreferrer"
                      className="text-btnColor font-bold text-lg break-all hover:underline inline-flex items-center gap-2">
                      {link.replace(/^https?:\/\//, "")} <FaExternalLinkAlt className="text-xs shrink-0" />
                    </a>
                    <p className="text-slate-500 text-sm truncate mt-1" title={u.originalurl}>{u.originalurl}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                      <span className="flex items-center gap-2"><FaMousePointer className="text-btnColor" /> <b>{u.clickCount}</b> {u.clickCount === 1 ? "click" : "clicks"}</span>
                      <span className="text-slate-400">{u.createdtime ? new Date(u.createdtime + "Z").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <CopyButton text={link} />
                    <motion.button whileTap={{ scale: 0.94 }} onClick={() => setOpenId(open ? null : u.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${open ? "bg-indigo-50 border-indigo-200 text-btnColor" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                      <FaChartLine /> Analytics
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.94 }} onClick={() => remove(u.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${confirmId === u.id ? "bg-red-600 text-white" : "border border-red-200 text-red-600 hover:bg-red-50"}`}>
                      <FaTrashAlt /> {confirmId === u.id ? "Sure?" : "Delete"}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 mb-2">CLICKS, LAST {days} DAYS</p>
                        <div className="h-60 relative">
                          <LinkAnalytics key={days} code={u.shortnerurl} days={days} token={token} onAuthError={handleAuthError} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateModal onClose={() => setShowCreate(false)} onCreated={onCreated} token={token}
            onAuthError={handleAuthError} initialUrl={prefill} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
