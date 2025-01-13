import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import Swal from 'sweetalert2';
import placeholder from '../assets/placeholder.svg';
import Footer from '../componentes/Footer';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [theme, setTheme] = useState('light'); // Modo claro/oscuro

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const fetchMovies = async () => {
    if (!query.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un término de búsqueda.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=1b3bb8c1&s=${query}`
      );
      const data = await response.json();
      if (data.Response === 'False') {
        Swal.fire({
          title: 'No encontrado',
          text: 'No se encontraron películas con ese término.',
          icon: 'info',
          confirmButtonText: 'Entendido',
        });
      } else {
        setMovies(data.Search);
        setQuery(''); // Limpiar el campo de búsqueda
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un problema al buscar las películas.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
      console.log(error)
    }
  };

  const addToWatchlist = (movie) => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isAlreadyAdded = watchlist.find((m) => m.imdbID === movie.imdbID);

    if (!isAlreadyAdded) {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      Swal.fire({
        title: 'Agregado',
        text: `${movie.Title} fue agregada a tu Watchlist.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } else {
      Swal.fire({
        title: 'Duplicado',
        text: `${movie.Title} ya está en tu Watchlist.`,
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
    }
  };

  return (
    <div className={`${theme} bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen`}>
      {/* Cabecera */}
      <header className="bg-blue-500 dark:bg-blue-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          <Link to="/">filmFinder</Link>
        </h1>
        <div className="flex items-center space-x-4">
          <Link to="/watchlist" className="text-white hover:underline">
            Watchlist
          </Link>
          <button
            onClick={toggleTheme}
            className="text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-fondo text-center py-12 text-white">
        <h2 className="text-4xl font-bold mb-4">Encuentra tu próxima película</h2>
        <p className="text-lg mb-6"> Busca entre millones de películas y agrega tus favoritas a tu Watchlist. </p>
      </section>

      {/* Búsqueda */}
      <div id="search" className="p-8">
        <div className="max-w-xl mx-auto flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <input type="text" placeholder="Buscar películas..." className="flex-grow px-4 py-2 focus:outline-none text-black" value={query} onChange={(e) => setQuery(e.target.value)}/>
          <button onClick={fetchMovies} className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Link to={`/movie/${movie.imdbID}`}> 
              <img src={movie.Poster !== 'N/A' ? movie.Poster : placeholder} alt={movie.Title} className="w-full h-64 object-contain"/>
            </Link>
            <div className="p-4">
            <Link to={`/movie/${movie.imdbID}`}>
              <h3 className="text-lg font-bold text-center text-black dark:text-white">{movie.Title}</h3>
            </Link>
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">{movie.Year}</p> */}
              <button onClick={() => addToWatchlist(movie)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaHeart />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default SearchPage;
