import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

function TemperatureChart({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  const data = {
    labels: forecast.map(day =>
      new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Temp (°C)',
        data: forecast.map(day => day.main.temp),
        borderColor: 'blue',
        backgroundColor: 'rgba(59,130,246,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        bodyFont: { size: 10 },
        titleFont: { size: 10 },
        displayColors: false,
        callbacks: {
          label: ctx => `Temp: ${ctx.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 5,
          font: { size: 8 },
        },
      },
      y: {
        beginAtZero: false,
        ticks: { font: { size: 8 } },
      },
    },
  };

  return (
    <div className="w-[110px] h-[90px] sm:w-[140px] sm:h-[100px] md:w-[160px] md:h-[120px]">
      <Line data={data} options={options} />
    </div>
  );
}

export default TemperatureChart;
