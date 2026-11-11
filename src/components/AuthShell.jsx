import { motion } from "framer-motion";

export const inputCls =
  "w-full px-3 py-2.5 border border-slate-300 rounded-md outline-none bg-white text-slate-800 focus:border-btnColor focus:ring-2 focus:ring-indigo-200 transition";

export const Field = ({ label, id, error, ...props }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-semibold text-sm text-slate-700">{label}</label>
    <input id={id} className={`${inputCls} ${error ? "border-red-500" : ""}`} {...props} />
    {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
  </div>
);

const AuthShell = ({ title, subtitle, children }) => (
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-300 border border-slate-100 p-6 sm:p-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">{title}</h1>
      <p className="text-slate-500 text-sm text-center mt-1 mb-6">{subtitle}</p>
      {children}
    </motion.div>
  </div>
);

export default AuthShell;
