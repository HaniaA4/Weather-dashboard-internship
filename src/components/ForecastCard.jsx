function ForecastCard({ day }) {
  const date = new Date(day.dt_txt).toLocaleDateString();

  return (
    <div className="bg-white rounded shadow p-4 text-center">
      <h3 className="font-semibold">{date}</h3>
      <p>{Math.round(day.main.temp)}°C</p>
      <p>{day.weather[0].main}</p>
    </div>
  );
}

export default ForecastCard;
