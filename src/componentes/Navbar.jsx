import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú móvil

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-fondoMovil md:bg-fondo text-center pt-[8.5em] pb-[8.5em] md:pt-[6.5em] md:pb-[6.5em] text-white">
      {/* Botón de tema */}
      <button onClick={toggleTheme} className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700">
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {/* Contenido principal */}
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {/* Botón del menú hamburguesa en móvil */}
        <button className="text-3xl text-gray-800 absolute top-4 left-4 md:hidden" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú de escritorio */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-white text-lg font-bold hover:text-gray-300">filmFinder</Link>
          <Link to="/watchlist" className="text-white text-lg font-bold hover:text-gray-300">WatchList</Link>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {menuOpen && (
        <div className="mt-4 md:hidden flex flex-col space-y-4">
          <Link to="/" className="text-white text-lg font-bold hover:text-gray-300" onClick={toggleMenu}>filmFinder</Link>
          <Link to="/watchlist" className="text-white text-lg font-bold hover:text-gray-300" onClick={toggleMenu}>WatchList</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
