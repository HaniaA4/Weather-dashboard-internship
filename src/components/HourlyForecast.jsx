function HourlyForecast({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="overflow-x-auto flex gap-4 items-center scrollbar-custom pb-2">
      {data.slice(0, 6).map((hour, idx) => (
        <div
          key={idx}
          className="min-w-[70px] sm:min-w-[90px] md:min-w-[100px] bg-blue-50 rounded-lg p-2 sm:p-3 text-center shadow-sm h-[90px] sm:h-[100px] md:h-[120px] flex flex-col justify-between overflow-hidden"
        >
          <p className="text-xs sm:text-sm font-medium truncate">
            {new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {/* Weather icon */}
          <img
            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
            alt={hour.weather[0].description}
            className="mx-auto w-7 h-7 sm:w-8 sm:h-8"
          />
          <p className="text-xs sm:text-base font-semibold truncate">{Math.round(hour.main.temp)}°C</p>
          <p className="text-[10px] sm:text-xs capitalize truncate">{hour.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
}
export default HourlyForecast;