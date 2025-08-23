import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function TemperatureChart({ forecast }) {
  const data = {
    labels: forecast.map(day => new Date(day.dt_txt).toLocaleDateString()),
    datasets: [
      {
        label: 'Temp (°C)',
        data: forecast.map(day => day.main.temp),
        borderColor: 'blue',
        backgroundColor: 'rgba(59,130,246,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { stepSize: 5 },
      },
    },
  };

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="text-xl font-semibold mb-2">3-Day Temperature Trend</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default TemperatureChart;
