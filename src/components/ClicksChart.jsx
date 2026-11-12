import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { lastDays } from "../utils/dates";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/** counts: { "2026-11-11": 3 } -> chart ready series over the whole range. */
const ClicksChart = ({ counts, days, height = "h-64" }) => {
  const dates = lastDays(days);
  const values = dates.map((d) => counts[d] || 0);
  const total = values.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className={`${height} flex items-center justify-center text-slate-400 text-sm text-center px-4`}>
        No clicks in this period yet. Share your link to see data here.
      </div>
    );
  }

  const data = {
    labels: dates.map((d) => d.slice(5)),
    datasets: [
      {
        label: "Clicks",
        data: values,
        backgroundColor: "#4f46e5",
        hoverBackgroundColor: "#7c3aed",
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { title: (items) => dates[items[0].dataIndex] } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } },
      y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#e2e8f0" } },
    },
  };

  return (
    <div className={height}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ClicksChart;
