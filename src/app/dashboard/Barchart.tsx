import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
    data: number[];
    labels: string[];
    backgroundColors?: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, labels, backgroundColors }) => {
    const defaultColors = ['#1A4D2E', '#003285', '#FF8911'];
    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: backgroundColors || defaultColors,
                hoverBackgroundColor: backgroundColors || defaultColors,
            },
        ],
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
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
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
