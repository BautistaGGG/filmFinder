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
    <nav className="bg-fondoMovil md:bg-fondo text-center pt-[6em] pb-[6em] text-white">      
      <button onClick={toggleTheme} className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700">
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <h1 className="text-white text-5xl font-bold "> <Link to="/">filmFinder</Link> </h1>
        <h1 className="text-white text-3xl font-bold hover:text-gray-300"> <Link to="/watchlist"> WatchList </Link> </h1>
      </div>
    </nav>
  );
};

export default Navbar;
