function CurrentWeather({ data }) {
  return (
    <div className="bg-blue-50 rounded shadow p-4 text-center mt-4">
      <h2 className="text-2xl font-semibold">{data.name}</h2>
      <p className="text-4xl">{Math.round(data.main.temp)}°C</p>
      <p>{data.weather[0].description}</p>
      <p>Feels like: {Math.round(data.main.feels_like)}°C</p>
    </div>
  );
}

export default CurrentWeather;
