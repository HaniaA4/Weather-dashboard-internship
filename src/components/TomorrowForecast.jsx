function TomorrowForecast({ data }) {
  const tomorrow = data.find(item =>
    new Date(item.dt_txt).getDate() === new Date().getDate() + 1 &&
    item.dt_txt.includes('12:00:00')
  );

  if (!tomorrow) return null;

  return (
    <div className="bg-white rounded shadow p-4 mt-4 text-center">
      <h3 className="text-xl font-semibold">Tomorrow</h3>
      <p>{Math.round(tomorrow.main.temp)}°C</p>
      <p>{tomorrow.weather[0].description}</p>
      <p>Humidity: {tomorrow.main.humidity}%</p>
      <p>Wind: {tomorrow.wind.speed} m/s</p>
    </div>
  );
}

export default TomorrowForecast;
