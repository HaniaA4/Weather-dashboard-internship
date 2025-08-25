function ForecastCard({ day }) {
  const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short' });
  const temp = Math.round(day.main.temp);
  const iconCode = day.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="min-w-[56px] max-w-[64px] bg-blue-50 rounded-lg p-1 text-center shadow-sm flex-shrink-0 h-full flex flex-col justify-between overflow-hidden">
      <p className="text-[10px] font-medium truncate">{date}</p>
      <img src={iconUrl} alt={day.weather[0].description} className="mx-auto w-7 h-7" />
      <p className="text-xs font-semibold">{temp}°C</p>
      <p className="text-[9px] capitalize truncate">{day.weather[0].description}</p>
    </div>
  );
}

export default ForecastCard;
