import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ForecastCard from './components/ForecastCard';
import Spinner from './components/Spinner';
import DarkModeToggle from './components/DarkModeToggle';
import TemperatureChart from './components/TempChart';
import SavedCities from './components/SavedCities';
import Highlights from './components/Highlights';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import TomorrowForecast from './components/TomorrowForecast';
import OtherCities from './components/OtherCities';

const cityPool = [
  'Paris', 'New York', 'Cairo', 'Tokyo', 'Sydney', 'Islamabad', 'Moscow', 'Rio de Janeiro', 'Toronto', 'Beijing', 'Cape Town',
  'Berlin', 'Madrid', 'Rome', 'Bangkok', 'Dubai', 'Singapore', 'Istanbul', 'Los Angeles', 'Chicago', 'Mumbai',
  'Seoul', 'Mexico City', 'Jakarta', 'Lagos', 'Buenos Aires', 'London', 'Lisbon', 'San Francisco', 'Stockholm', 'Vienna'
];

function getRandomCities(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [savedCities, setSavedCities] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem('savedCities');
    return saved ? JSON.parse(saved) : [];
  });
  const [uvIndex, setUvIndex] = useState(null);
  const [chanceOfRain, setChanceOfRain] = useState(null);
  const [otherCitiesWeather, setOtherCitiesWeather] = useState({});
  const [otherCities, setOtherCities] = useState(() => getRandomCities(cityPool, 3)); // 3 random cities
  const [selectedSavedCity, setSelectedSavedCity] = useState(null);
  const [openSavedCity, setOpenSavedCity] = useState(null);
  const [openSavedCityWeather, setOpenSavedCityWeather] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'd6cb0b5b5f78bb3a531252591cda0069';

  const fetchWeather = async (city) => {
    setError('');
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWeather(data);
      setError('');
      return true;
    } catch {
      setError('City not found. Enter a valid city name.');
      return false;
    }
  };

  const fetchForecast = async (city) => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    setForecast(res.data.list.filter(item => item.dt_txt.includes('12:00:00')));
    setHourly(res.data.list.slice(0, 6));
    setChanceOfRain(res.data.list[0]?.pop ?? null); // pop is 0-1
  };

  useEffect(() => {
    async function fetchAllOtherCities() {
      const weatherData = {};
      for (const city of otherCities) {
        try {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
          );
          weatherData[city] = res.data;
        } catch {
          weatherData[city] = null;
        }
      }
      setOtherCitiesWeather(weatherData);
    }
    fetchAllOtherCities();
  }, [otherCities]);

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
  }, []);

  const handleShowSavedCity = (city) => {
    if (openSavedCity === city) {
      // Clicking again closes the box
      setOpenSavedCity(null);
      setOpenSavedCityWeather(null);
      return;
    }
    setOpenSavedCity(city);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      )
      .then(res => setOpenSavedCityWeather(res.data));
  };

  // Function to handle searching for a city
  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    try {
      setError('');
      await fetchWeather(searchInput.trim());
    } catch {
      setError('City not found. Enter a valid city name.');
    }
  };

  // Function to handle saving a city (only if valid)
  const handleSaveCity = async () => {
    const city = searchInput.trim();
    if (!city || savedCities.includes(city)) return;
    // Use a separate error state for saving, or just set error only if invalid
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw new Error();
      if (!savedCities.includes(city)) {
        setSavedCities([...savedCities, city]);
      }
      setError(''); // Clear error if city is valid
    } catch {
      setError('City not found. Enter a valid city name.');
    }
  };

  // Sync savedCities to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }, [savedCities]);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-blue-300'} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-6">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <Header />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Search city..."
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button
            className="px-4 py-2 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 transition"
            onClick={handleSearch}
            disabled={!searchInput.trim()}
          >
            Search
          </button>
          <button
            className={`px-4 py-2 rounded text-sm transition ${
              searchInput && savedCities.includes(searchInput.trim())
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={handleSaveCity}
            disabled={!searchInput.trim() || savedCities.includes(searchInput.trim())}
          >
            {searchInput && savedCities.includes(searchInput.trim()) ? 'Saved' : 'Save City'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Today's Weather (with Tomorrow's Weather inside) */}
          <div>
            {weather && (
              <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4 flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Current Weather</h3>
                  <CurrentWeather data={weather} />
                </div>
                {forecast.length > 0 && (
                  <div className="w-36">
                    <h4 className="font-semibold mb-1 text-center">Tomorrow</h4>
                    <TomorrowForecast data={forecast} />
                  </div>
                )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left: Forecasts + Sun Info */}
          <div>
            <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">Forecast</h3>
              {hourly.length > 0 && <HourlyForecast data={hourly} />}
              {forecast.length > 0 && <TemperatureChart forecast={forecast} />}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {forecast.map((day, idx) => (
                  <ForecastCard key={idx} day={day} />
                ))}
              </div>
              {/* Optional: Sunrise/Sunset */}
              {/* {weather && <SunInfo data={weather} />} */}
            </div>
          </div>
          {/* Right: Saved & Other Cities */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-400/20 rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Saved Cities</h3>
              <div className="flex flex-wrap gap-2">
                {savedCities.map(city => (
                  <div key={city} className="relative">
                    <button
                      className="bg-blue-100 rounded px-2 py-1 text-sm"
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
              <h3 className="text-lg font-semibold">Other Cities</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">   
               {otherCities.map(city => (
                  <div
                    key={city}
                    className="bg-white rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-full w-full"
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
        {weather && !savedCities.includes(weather.name) }
      </div>
    </div>
  );
}

export default App;
