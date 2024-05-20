import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, TooltipCallbacks } from 'chart.js/auto';

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: number[];
    labels: string[];
    backgroundColors?: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, labels, backgroundColors }) => {
    const defaultColors = ['#1A4D2E', '#003285', '#FF8911'];
    const chartData = {
        datasets: [
            {
                data: data,
                backgroundColor: backgroundColors || defaultColors,
                hoverBackgroundColor: backgroundColors || defaultColors,
            },
        ],
        labels: labels,
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
    };

    return (
        <div >
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
