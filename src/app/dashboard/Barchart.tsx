import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
  datasets: { data: number[]; label: string; backgroundColor: string }[];
  labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ datasets, labels }) => {
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white",
        },
      },

      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "white", // X-axis text color
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid line color
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white", // Y-axis text color
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid line color
        },
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
