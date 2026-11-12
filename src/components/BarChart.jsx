import { motion } from "framer-motion";

const niceMax = (m) => (m <= 4 ? 4 : Math.ceil(m / 4) * 4);

const BarChart = ({ data, height = 300 }) => {
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 text-xs text-slate-600 mb-3">
        <span className="inline-block w-10 h-3 bg-blue-500" /> Total Clicks
      </div>
      <div className="flex">
        <p className="text-slate-600 font-bold text-sm [writing-mode:vertical-rl] rotate-180 mr-2 self-center">
          Number Of Clicks
        </p>
        <div className="flex-1 min-w-0">
          <div className="relative flex" style={{ height }}>
            <div className="flex flex-col-reverse justify-between text-xs text-slate-500 pr-2 -mb-2 -mt-2">
              {ticks.map((t) => <span key={t}>{Number.isInteger(t) ? t : t.toFixed(1)}</span>)}
            </div>
            <div className="relative flex-1 border-l border-b border-slate-300">
              {ticks.map((t) => (
                <div key={t} className="absolute left-0 right-0 border-t border-slate-200"
                  style={{ bottom: `${(t / max) * 100}%` }} />
              ))}
              <div className="absolute inset-0 flex items-end justify-around gap-1 sm:gap-2 px-1">
                {data.map((d) => (
                  <div key={d.label} className="group relative flex-1 max-w-10 h-full flex items-end justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.value / max) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-full bg-blue-500 hover:bg-indigo-500 rounded-t-sm transition-colors"
                    />
                    <span className="pointer-events-none absolute -top-7 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {d.label}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-around gap-1 sm:gap-2 px-1 mt-1 ml-5">
            {data.map((d, i) => (
              <span key={d.label} className="flex-1 max-w-10 text-center text-[10px] sm:text-xs text-slate-500">
                {data.length > 8 && i % 2 === 1 ? "" : d.label.slice(5)}
              </span>
            ))}
          </div>
          <p className="text-center font-bold text-slate-600 mt-1">Date</p>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
