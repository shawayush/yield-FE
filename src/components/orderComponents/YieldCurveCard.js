import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import LineChart from "./LineChart";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { point: { radius: 1, rotation: 30 } },
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = [0, 2, 4, 6, 8, 10, 12];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [20, 50, 100, 20, 40, 23, 44],
      borderColor: "#0EE29B",
      backgroundColor: "#0EE29B99",
    },
  ],
};
function YieldCurveCard() {
  return (
    <div className=" h-full bg-[#15191D] p-6">
      <span className="text-xl font-bold text-white">Yield Curve</span>
      <LineChart />
    </div>
  );
}

export default YieldCurveCard;