import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** counts: { "2026-11-11": 3 } -> bar chart of the days that have clicks. */
const ClicksChart = ({ counts }) => {
  const labels = Object.keys(counts).sort();
  const values = labels.map((l) => counts[l]);

  if (labels.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h3 className="sm:text-2xl text-lg font-bold text-slate-800 mb-1">No Data For This Time Period</h3>
        <p className="sm:w-96 w-full text-sm sm:text-base text-slate-600">
          Share your short link to view where your engagement is coming from
        </p>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Total Clicks",
        data: values,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        barThickness: 24,
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: { legend: { display: true } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: "Number Of Clicks", font: { family: "Roboto", size: 16, weight: "bold" }, color: "#475569" },
      },
      x: {
        title: { display: true, text: "Date", font: { family: "Roboto", size: 16, weight: "bold" }, color: "#475569" },
      },
    },
  };

  return <Bar className="w-full" data={data} options={options} />;
};

export default ClicksChart;
