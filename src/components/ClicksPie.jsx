import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#4f46e5", "#7c3aed", "#db2777", "#3b82f6", "#14b8a6", "#f59e0b", "#94a3b8"];
const MAX_SLICES = 5;

/** Share of clicks per short link. urls: [{ shortnerurl, clickCount }] */
const ClicksPie = ({ urls }) => {
  const withClicks = urls
    .filter((u) => (u.clickCount || 0) > 0)
    .sort((a, b) => b.clickCount - a.clickCount);

  if (withClicks.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h3 className="sm:text-xl text-lg font-bold text-slate-800 mb-1">No clicks yet</h3>
        <p className="text-sm text-slate-600">Open or share a short link to see which ones perform best</p>
      </div>
    );
  }

  const top = withClicks.slice(0, MAX_SLICES);
  const rest = withClicks.slice(MAX_SLICES).reduce((s, u) => s + u.clickCount, 0);
  const labels = top.map((u) => u.shortnerurl);
  const values = top.map((u) => u.clickCount);
  if (rest > 0) {
    labels.push("Others");
    values.push(rest);
  }
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed} ${ctx.parsed === 1 ? "click" : "clicks"} (${Math.round((ctx.parsed / total) * 100)}%)`,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default ClicksPie;
