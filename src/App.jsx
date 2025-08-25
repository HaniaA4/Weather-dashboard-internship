import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ForecastCard from './components/ForecastCard';
import Highlights from './components/Highlights';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import TomorrowForecast from './components/TomorrowForecast';
import Spinner from './components/Spinner';
import TemperatureChart from './components/TempChart';

const cityPool = [
  'Paris', 'New York', 'Cairo', 'Tokyo', 'Sydney', 'Islamabad', 'Moscow', 'Rio de Janeiro', 'Toronto', 'Beijing', 'Cape Town',
  'Berlin', 'Madrid', 'Rome', 'Bangkok', 'Dubai', 'Singapore', 'Istanbul', 'Los Angeles', 'Chicago', 'Mumbai',
  'Seoul', 'Mexico City', 'Jakarta', 'Lagos', 'Buenos Aires', 'London', 'Lisbon', 'San Francisco', 'Stockholm', 'Vienna'
];

function getRandomCities(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// --- Reusable helpers ---
const getWeatherData = async (city, apiKey) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  if (!res.ok) throw new Error('City not found. Enter a valid city name.');
  return await res.json();
};

const filterForecastByHour = (list, hourStr = '12:00:00') =>
  list.filter(item => item.dt_txt.includes(hourStr));

function ActionButton({ children, onClick, disabled }) {
  return (
    <button
      className={`px-4 py-2 rounded text-sm transition ${
        disabled
          ? 'bg-gray-400/20 font-medium text-gray-900 cursor-not-allowed'
          : 'bg-blue-400 text-white hover:bg-blue-600'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem('savedCities');
    return saved ? JSON.parse(saved) : [];
  });
  const [uvIndex, setUvIndex] = useState(null);
  const [chanceOfRain, setChanceOfRain] = useState(null);
  const [otherCitiesWeather, setOtherCitiesWeather] = useState({});
  const [otherCities, setOtherCities] = useState(() => getRandomCities(cityPool, 3));
  const [openSavedCity, setOpenSavedCity] = useState(null);
  const [openSavedCityWeather, setOpenSavedCityWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = 'd6cb0b5b5f78bb3a531252591cda0069';
  const trimmedInput = useMemo(() => searchInput.trim(), [searchInput]);

  // --- Weather fetchers ---
  const fetchWeather = useCallback(async (city) => {
    setError('');
    setWeather(null);
    setLoading(true);
    try {
      const data = await getWeatherData(city, apiKey);
      setWeather(data);
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const fetchForecast = useCallback(async (city) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      setForecast(filterForecastByHour(res.data.list));
      setHourly(res.data.list.slice(0, 6));
      setChanceOfRain(res.data.list[0]?.pop ?? null);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  // --- Other cities weather ---
  useEffect(() => {
    async function fetchAllOtherCities() {
      const weatherData = {};
      for (const city of otherCities) {
        try {
          weatherData[city] = await getWeatherData(city, apiKey);
        } catch {
          weatherData[city] = null;
        }
      }
      setOtherCitiesWeather(weatherData);
    }
    fetchAllOtherCities();
  }, [otherCities, apiKey]);

  // --- Geolocation on mount ---
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        setWeather(res.data);
        fetchForecast(res.data.name);
      },
      () => fetchWeather('Lisbon')
    );
    // eslint-disable-next-line
  }, []);

  // --- Saved city preview ---
  const handleShowSavedCity = async (city) => {
    if (openSavedCity === city) {
      setOpenSavedCity(null);
      setOpenSavedCityWeather(null);
      return;
    }
    setLoading(true);
    setOpenSavedCity(city);
    try {
      setOpenSavedCityWeather(await getWeatherData(city, apiKey));
    } catch {
      setOpenSavedCityWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Search handler ---
  const handleSearch = async () => {
    if (!trimmedInput) return;
    await fetchWeather(trimmedInput);
  };

  // --- Save city handler ---
  const handleSaveCity = async () => {
    if (!trimmedInput || savedCities.includes(trimmedInput)) return;
    try {
      await getWeatherData(trimmedInput, apiKey);
      setSavedCities([...savedCities, trimmedInput]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Persist saved cities ---
  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }, [savedCities]);

  return (
      <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen p-6 transition-colors duration-300">      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Controls */}
        <div className="flex justify-end items-center mb-6">
          <Header />
        </div>
        <div className="flex flex-row items-stretch gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto"
            placeholder="Search city..."
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <ActionButton
            onClick={handleSearch}
            disabled={!trimmedInput}
            className="w-auto"
          >
            Search
          </ActionButton>
          <ActionButton
            onClick={handleSaveCity}
            disabled={!trimmedInput || savedCities.includes(trimmedInput)}
            className="w-auto"
          >
            {trimmedInput && savedCities.includes(trimmedInput) ? 'Saved' : 'Save City'}
          </ActionButton>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Today's Weather (with Tomorrow's Weather inside) */}
          <div>
            {loading && <Spinner />}
            {!loading && weather && (
              <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4 h-full">
                <div className="flex flex-row gap-4 w-full">
                  {/* Current Weather */}
                  
                  <div className="w-1/2 min-w-0">
                  <h4 className="text-base sm:text-xl font-semibold mb-2 whitespace-nowrap">
                    Current Weather
                    </h4>
                    <CurrentWeather data={weather} />
                  </div>
                  {/* Tomorrow Weather */}
                  
                  <div className="w-1/2 min-w-0">
                    <h4 className="text-base sm:text-xl font-semibold mb-2 text-center whitespace-nowrap">
                      Tomorrow
                    </h4>
                    <TomorrowForecast data={forecast} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Right: Today's Highlights */}
          <div>
            <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4 h-full">
              <h3 className="text-xl font-semibold mb-4">Today's Highlights</h3>
              {weather && (
                <Highlights data={weather} uvIndex={uvIndex} chanceOfRain={chanceOfRain} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Left: Forecasts + Sun Info */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4 space-y-2 h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Forecast</h3>
              
              {hourly.length > 0 && <HourlyForecast data={hourly} />}
              {forecast && forecast.length > 0 && (
                <div className="flex flex-row items-start gap-6 h-24">
                  {/* Forecast Cards: always swipable */}
                  <div className="overflow-x-auto flex gap-4 scrollbar-custom mt-2 pb-2">
                    {forecast.map((day, idx) => (
                      <ForecastCard key={idx} day={day} />
                    ))}
                  </div>
                  {/* Temperature Chart */}
                  <div className="flex-shrink-0 h-full flex items-center mt-4">
                    <TemperatureChart forecast={forecast} />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Right: Saved & Other Cities */}
          <div className="h-full space-y-4 flex flex-col">
            <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4 mb-4">
              <h3 className="text-xl font-semibold mb-3">Saved Cities</h3>
              <div className="flex flex-wrap gap-2">
                {savedCities.map(city => (
                  <div key={city} className="relative">
                    <button
                      className="bg-blue-50 rounded px-2 py-1 text-sm mb-2"
                      onClick={() => handleShowSavedCity(city)}
                    >
                      {city}
                    </button>
                    {openSavedCity === city && openSavedCityWeather && (
                      <div className="absolute left-0 top-10 z-10 bg-white rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-28 w-32">
                        <h4 className="text-sm font-semibold mb-1">{openSavedCityWeather.name}</h4>
                        <p className="text-lg">{Math.round(openSavedCityWeather.main.temp)}°C</p>
                        <p className="text-xs capitalize">{openSavedCityWeather.weather[0].description}</p>
                        <p className="text-xs">Humidity: {openSavedCityWeather.main.humidity}%</p>
                        <p className="text-xs">Wind: {openSavedCityWeather.wind.speed} m/s</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4">
              <h3 className="text-xl font-semibold">Other Cities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {otherCities.map(city => (
                  <div
                    key={city}
                    className="bg-blue-50 rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-full w-full"
                    style={{ minWidth: 0 }}
                  >
                    {otherCitiesWeather[city] ? (
                      <>
                        <h4 className="text-sm font-semibold mb-1">{city}</h4>
                        <p className="text-lg">{Math.round(otherCitiesWeather[city].main.temp)}°C</p>
                        <p className="text-xs capitalize">{otherCitiesWeather[city].weather[0].description}</p>
                        <p className="text-xs">Humidity: {otherCitiesWeather[city].main.humidity}%</p>
                        <p className="text-xs">Wind: {otherCitiesWeather[city].wind.speed} m/s</p>
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
