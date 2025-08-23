function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}

export default DarkModeToggle;
