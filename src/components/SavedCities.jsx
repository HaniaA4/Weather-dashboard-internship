function SavedCities({ cities, onSelect }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {cities.map((city, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(city)}
          className="bg-blue-300 px-3 py-1 rounded hover:bg-blue-400 transition"
        >
          {city}
        </button>
      ))}
    </div>
  );
}

export default SavedCities;
