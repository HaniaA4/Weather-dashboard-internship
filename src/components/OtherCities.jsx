function OtherCities({ cities, onSelect }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Explore Other Cities</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* City cards */}
        {cities.map((city, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(city)}
            className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300 transition"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OtherCities;
