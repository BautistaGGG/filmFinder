import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme); // Guarda el tema en localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-blue-500 dark:bg-blue-700 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">
        <Link to="/">filmFinder</Link>
      </h1>
      <div className="flex items-center space-x-4">
        <Link to="/watchlist" className="text-white text-2xl font-bold hover:underline">
          WatchList
        </Link>
        <button
          onClick={toggleTheme}
          className="text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
