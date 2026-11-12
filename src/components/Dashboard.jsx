import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaExternalLinkAlt, FaRegCalendarAlt, FaRegCopy, FaLink, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdAnalytics, MdOutlineAdsClick } from "react-icons/md";
import { api, shortLink } from "../api";
import { useStoreContext } from "../contextApi/ContextApi";
import { inputCls } from "./AuthShell";
import ClicksChart from "./ClicksChart";
import { lastRange } from "../utils/dates";

const toCounts = (data) => {
  const out = {};
  if (Array.isArray(data)) data.forEach((d) => { out[d.clickDate] = d.count; });
  else if (data) Object.assign(out, data);
  return out;
};

const copyText = async (text) => {
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
};

const CopyButton = ({ text, className = "" }) => {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    await copyText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={onClick}
      className={`flex cursor-pointer gap-1 items-center py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white transition-colors ${done ? "bg-green-600" : "bg-btnColor"} ${className}`}>
      <span>{done ? "Copied" : "Copy"}</span>
      {done ? <FaCheck /> : <FaRegCopy />}
    </motion.button>
  );
};

/* Fetch on mount. Remount with a new `key` to reload. */
const useClicks = (loader, deps) => {
  const [state, setState] = useState({ counts: null, failed: false });
  const [token, onAuthError] = deps;
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

const TotalChart = ({ token, onAuthError }) => {
  const [start, end] = lastRange(30);
  const { counts, failed } = useClicks(() => api.totalClicks(start, end, token), [token, onAuthError]);
  if (failed) return <p className="absolute inset-0 flex items-center justify-center text-sm text-red-500">Could not load analytics.</p>;
  if (!counts) return <div className="absolute inset-0 skeleton rounded-md" />;
  return <ClicksChart counts={counts} />;
};

const LinkAnalytics = ({ code, token, onAuthError }) => {
  const [start, end] = lastRange(30);
  const { counts, failed } = useClicks(() => api.analytics(code, start, end, token), [token, onAuthError]);
  if (failed) return <p className="absolute inset-0 flex items-center justify-center text-sm text-red-500">Could not load analytics.</p>;
  if (!counts) return <div className="absolute inset-0 skeleton rounded-md" />;
  return <ClicksChart counts={counts} />;
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
        className="bg-white rounded-md shadow-2xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><FaTimes /></button>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Create New Short URL</h2>

        {created ? (
          <div>
            <p className="text-sm text-slate-500 mb-2">Your short link is ready</p>
            <div className="p-3 rounded-md bg-slate-100 border border-dotted border-slate-500 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <a href={shortLink(created.shortnerurl)} target="_blank" rel="noreferrer"
                className="text-slate-900 font-semibold break-all hover:underline">{shortLink(created.shortnerurl)}</a>
              <CopyButton text={shortLink(created.shortnerurl)} />
            </div>
            <button onClick={onClose} className="mt-5 w-full border border-slate-300 rounded-md py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="url" className="font-semibold text-md text-slate-800 block mb-1">Enter URL</label>
              <input id="url" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" autoComplete="off"
                placeholder="https://example.com" className={inputCls} />
            </div>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <motion.button whileTap={{ scale: 0.97 }} disabled={busy} type="submit"
              className="bg-custom-gradient text-white font-semibold rounded-md py-2.5 w-32 disabled:opacity-60">
              {busy ? "Creating..." : "Create"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const ShortItem = ({ u, open, onToggle, confirming, onDelete, token, onAuthError }) => {
  const link = shortLink(u.shortnerurl);
  const clicks = u.clickCount || 0;
  return (
    <motion.li layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="bg-slate-100 shadow-lg border border-dotted border-slate-500 px-6 sm:py-1 py-3 rounded-md">
      <div className="flex sm:flex-row flex-col sm:justify-between w-full sm:gap-0 gap-5 py-5">
        <div className="flex-1 sm:space-y-1 max-sm:space-y-2 overflow-x-auto overflow-y-hidden">
          <div className="text-slate-900 pb-1 sm:pb-0 flex items-center gap-2">
            <a href={link} target="_blank" rel="noreferrer" className="text-[17px] font-montserrat font-[600] text-slate-900 hover:underline">
              {link.replace(/^https?:\/\//, "")}
            </a>
            <FaExternalLinkAlt className="text-slate-900 text-sm shrink-0" />
          </div>
          <h3 className="text-slate-700 font-[400] text-[17px] break-all">{u.originalurl}</h3>
          <div className="flex items-center gap-8 pt-6">
            <div className="flex gap-1 items-center font-semibold text-green-800">
              <MdOutlineAdsClick className="text-[22px] me-1" />
              <span className="text-[16px]">{clicks}</span>
              <span className="text-[15px]">{clicks <= 1 ? "Click" : "Clicks"}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-lg text-slate-800">
              <FaRegCalendarAlt />
              <span className="text-[17px]">
                {u.createdtime ? new Date(u.createdtime + "Z").toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap flex-1 sm:justify-end items-center gap-3">
          <CopyButton text={link} />
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={onToggle}
            className="flex cursor-pointer gap-1 items-center bg-rose-700 py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white">
            <span>Analytics</span>
            <MdAnalytics />
          </motion.button>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onDelete} aria-label="Delete link" title="Delete"
            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${confirming ? "bg-red-600 text-white" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`}>
            <FaTrashAlt /> {confirming && "Sure?"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 320 }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }} className="relative border-t-2 w-full overflow-hidden">
            <div className="absolute inset-0 pt-3 pb-2">
              <div className="relative w-full h-full">
                <LinkAnalytics code={u.shortnerurl} token={token} onAuthError={onAuthError} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
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

  return (
    <div className="lg:px-14 sm:px-8 px-4 min-h-[calc(100vh-64px)]">
      <div className="lg:w-[90%] w-full mx-auto py-12 sm:py-16">
        <div className="h-96 relative">
          <TotalChart key={chartKey} token={token} onAuthError={handleAuthError} />
        </div>

        <div className="py-5 sm:text-end text-center">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowCreate(true)}
            className="bg-custom-gradient px-4 py-2 rounded-md text-white">
            Create a New Short URL
          </motion.button>
        </div>

        {error && <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>}

        <div>
          {loading ? (
            <div className="space-y-4">{[0, 1].map((i) => <div key={i} className="skeleton h-36 rounded-md" />)}</div>
          ) : urls.length === 0 ? (
            <div className="flex justify-center pt-10">
              <div className="flex gap-2 items-center justify-center py-6 sm:px-8 px-5 rounded-md shadow-lg bg-gray-50">
                <h1 className="text-slate-800 font-montserrat sm:text-[18px] text-[14px] font-semibold">
                  You haven't created any short link yet
                </h1>
                <FaLink className="text-blue-500 sm:text-xl text-sm" />
              </div>
            </div>
          ) : (
            <ul className="space-y-7">
              {urls.map((u) => (
                <ShortItem key={u.id} u={u} open={openId === u.id} confirming={confirmId === u.id}
                  onToggle={() => setOpenId(openId === u.id ? null : u.id)} onDelete={() => remove(u.id)}
                  token={token} onAuthError={handleAuthError} />
              ))}
            </ul>
          )}
        </div>
      </div>

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
