function HourlyForecast({ data }) {
  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="text-xl font-semibold mb-2">Next Hours</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Hourly cards */}
        {data.map((hour, idx) => (
          <div key={idx} className="text-center">
            <p>{new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>{Math.round(hour.main.temp)}°C</p>
            <p>{hour.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
