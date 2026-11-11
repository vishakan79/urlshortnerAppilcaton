import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLink, FaChartLine, FaShieldAlt, FaBolt, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import Card from "./Card";
import { useStoreContext } from "../contextApi/ContextApi";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const features = [
  [<FaLink key="l" />, "Instant short links", "Paste a long URL and get a clean, shareable short link in one click."],
  [<FaChartLine key="c" />, "Click tracking", "See how many times every link was opened, right from your dashboard."],
  [<FaShieldAlt key="s" />, "Secure accounts", "JWT authentication and encrypted passwords keep your links private."],
  [<FaBolt key="b" />, "Fast redirects", "Lightweight backend that sends visitors to the destination in a blink."],
];

const steps = [
  ["1", "Create an account", "Sign up free in under a minute."],
  ["2", "Paste your long link", "We generate a short, unique code instantly."],
  ["3", "Share and track", "Copy the link and watch your clicks grow."],
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();
  const [url, setUrl] = useState("");

  const start = (e) => {
    e?.preventDefault();
    navigate(token ? "/dashboard" : "/register", { state: { url } });
  };

  return (
    <div className="overflow-hidden">
      <section className="hero-bg">
        <div className="max-w-6xl mx-auto lg:px-8 px-4 pt-12 pb-16 lg:pt-20 lg:pb-24 flex lg:flex-row flex-col items-center gap-12">
          <div className="flex-1 w-full">
            <motion.span {...fade(0)} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-5">
              <FaBolt /> Fast, free URL shortener
            </motion.span>
            <motion.h1 {...fade(0.05)} className="font-extrabold text-slate-900 text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
              Short links that <span className="text-gradient">work harder</span> for you.
            </motion.h1>
            <motion.p {...fade(0.1)} className="text-slate-600 text-base sm:text-lg mt-5 max-w-xl">
              Turn long, messy URLs into clean links you can share anywhere, and track every click from one simple dashboard.
            </motion.p>

            <motion.form {...fade(0.15)} onSubmit={start} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long link here..."
                inputMode="url"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit"
                className="bg-custom-gradient text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                Shorten <FaArrowRight className="text-sm" />
              </motion.button>
            </motion.form>
            <motion.ul {...fade(0.2)} className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {["No credit card", "Click analytics", "Secure login"].map((t) => (
                <li key={t} className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> {t}</li>
              ))}
            </motion.ul>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.1 }}
            className="flex-1 w-full max-w-md">
            <div className="animate-float bg-white rounded-2xl shadow-2xl shadow-indigo-200 border border-slate-100 p-5">
              <p className="text-xs font-semibold text-slate-400 mb-2">LONG URL</p>
              <p className="text-sm text-slate-500 break-all bg-slate-50 rounded-lg p-3">
                https://www.example.com/products/summer-collection/new-arrivals?utm_source=newsletter&utm_campaign=sale
              </p>
              <div className="flex justify-center my-3 text-indigo-400"><FaArrowRight className="rotate-90" /></div>
              <p className="text-xs font-semibold text-slate-400 mb-2">SHORT LINK</p>
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                <span className="font-bold text-btnColor">linklytics.app/aB3xK9q</span>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">128 clicks</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto lg:px-8 px-4 py-14">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
          className="text-center text-slate-900 font-bold text-2xl sm:text-3xl">
          Everything you need to share smarter
        </motion.h2>
        <p className="text-center text-slate-500 mt-2 mb-10">Simple tools, no clutter.</p>
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5">
          {features.map(([icon, title, desc], i) => (
            <Card key={title} icon={icon} title={title} desc={desc} index={i} />
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto lg:px-8 px-4 py-14">
          <h2 className="text-center text-slate-900 font-bold text-2xl sm:text-3xl mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(([n, t, d], i) => (
              <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }} className="text-center px-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-custom-gradient text-white font-bold text-lg flex items-center justify-center mb-3">{n}</div>
                <h3 className="font-bold text-slate-900">{t}</h3>
                <p className="text-slate-600 text-sm mt-1">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto lg:px-8 px-4 py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
          className="bg-custom-gradient rounded-3xl text-center text-white px-6 py-12 shadow-xl shadow-indigo-200">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to shorten your first link?</h2>
          <p className="text-indigo-100 mt-2 mb-6">Join now and get your first short link in seconds.</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={() => navigate(token ? "/dashboard" : "/register")}
            className="bg-white text-indigo-700 font-semibold rounded-xl px-8 py-3">
            {token ? "Go to Dashboard" : "Get started free"}
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
