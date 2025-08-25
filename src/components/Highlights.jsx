import { WiHumidity, WiStrongWind, WiDaySunny, WiRaindrop } from 'react-icons/wi';

function Highlights({ data, uvIndex, chanceOfRain }) {
  if (!data || !data.main || !data.wind) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {/* Humidity */}
      <div className="bg-blue-50 rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-24 w-full">
        <WiHumidity className="text-2xl mb-1 text-blue-500" />
        <h4 className="text-sm font-semibold mb-1">Humidity</h4>
        <p className="text-lg">{data.main.humidity}%</p>
      </div>

      {/* Wind Speed */}
      <div className="bg-blue-50 rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-24 w-full">
        <WiStrongWind className="text-2xl mb-1 text-blue-500" />
        <h4 className="text-sm font-semibold mb-1">Wind Speed</h4>
        <p className="text-lg">{data.wind.speed} m/s</p>
      </div>

      {/* UV Index */}
      <div className="bg-blue-50 rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-24 w-full">
        <WiDaySunny className="text-2xl mb-1 text-yellow-600" />
        <h4 className="text-sm font-semibold mb-1">UV Index</h4>
        <p className="text-lg">{uvIndex !== null ? uvIndex : '—'}</p>
      </div>

      {/* Chance of Rain */}
      <div className="bg-blue-50 rounded-lg shadow-md p-3 text-center flex flex-col justify-center items-center h-24 w-full">
        <WiRaindrop className="text-2xl mb-1 text-blue-500" />
        <h4 className="text-sm font-semibold mb-1">Chance of Rain</h4>
        <p className="text-lg">{chanceOfRain !== null ? Math.round(chanceOfRain * 100) + '%' : '—'}</p>
      </div>
    </div>
  );
}

export default Highlights;
