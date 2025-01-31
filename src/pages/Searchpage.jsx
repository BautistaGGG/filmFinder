import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import placeholder from '../assets/placeholder.svg';
import Footer from '../componentes/Footer';
import Navbar from '../componentes/Navbar';
import starIcon from '../assets/star.png';
import filmIcon from "../assets/IconDark.png";
import filmIcon2 from "../assets/IconWhite.png";

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [theme, setTheme] = useState('light'); // Modo claro/oscuro
  const [loading, setLoading] = useState(false); // Estado de carga
  // const [peliDuplicada, setPeliDuplicada] = useState(false); // Estado de película duplicada

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const fetchMovies = async (page = 1) => {
    if (!query.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un término de búsqueda.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    setLoading(true); // Activar estado de carga

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=1b3bb8c1&s=${query}&page=${page}`
      );
      const data = await response.json();
      if (data.Response === 'False') {
        Swal.fire({
          title: 'No encontrado',
          text: 'La base de datos no posee ese título. Intenta con otro',
          icon: 'info',
          confirmButtonText: 'Entendido',
        });
        setMovies([]); // Limpiar resultados anteriores
      } else {
        // Obtener detalles adicionales
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailResponse = await fetch(`https://www.omdbapi.com/?apikey=1b3bb8c1&i=${movie.imdbID}`);
            const details = await detailResponse.json();
            return details.Response === 'True' ? details : movie;
          })
        );

        setMovies(detailedMovies);
        setCurrentPage(page); // Actualizar página actual
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un problema al buscar las películas.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
      console.error(error);
    } finally {
      setLoading(false); // Desactivar estado de carga
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

  const handleNextPage = () => {
    fetchMovies(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchMovies(currentPage - 1);
    }
  };

  return (
    <div className={`${theme} bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Búsqueda */}
      <div id="search" className="-mt-5 pb-8 mx-6">
        <div className="max-w-xl mx-auto flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <input type="text" placeholder="Buscar películas..." className="flex-grow px-4 py-2 focus:outline-none text-black border border-r-gray-800" value={query} onChange={(e) => setQuery(e.target.value)}/>
          <button onClick={() => fetchMovies(1)} className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white px-4 py-2">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Texto por defecto */}
      {movies.length === 0 && !loading && (
        <>
          {theme == 'light' ? 
            <img src={filmIcon} className='block my-0 mx-auto'/> : 
            <img src={filmIcon2} className='block my-0 mx-auto'/>
          }
          <h3 className='text-center text-2xl lg:text-4xl text-gray-800 my-4 dark:text-white font-bold'> Te invitamos a explorar nuestro contenido </h3>
          <p className='text-center text-md lg:text-xl text-gray-500 my-4 dark:text-white'> Contamos con una watchList para que almacenes tus films favoritos </p>
        </>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center my-8">
          <p className="text-xl font-bold text-gray-800 dark:text-white">Buscando en la base de datos...</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && (
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col justify-between h-full">
              <Link to={`/movie/${movie.imdbID}`}>
                <img src={movie.Poster !== 'N/A' ? movie.Poster : placeholder} alt={movie.Title} className="w-full h-64 object-contain" />
              </Link>
              <div className="p-4 flex flex-col">
                <div className='flex flex-row justify-center items-center'>
                  <Link to={`/movie/${movie.imdbID}`} className='flex flex-row justify-between items-center'>
                    <h3 className="text-lg font-bold text-center text-black dark:text-white">{movie.Title}</h3>
                  </Link>
                  <div className='flex flex-row justify-center items-center ml-2'>
                    <img src={starIcon} />
                    <p className="text-sm text-center pl-1 text-gray-600 dark:text-gray-400"> {movie.imdbRating || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">{movie.Genre}</p>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400"> {movie.Runtime}</p>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">{movie.Plot}</p>
              </div>
              <div className="mt-auto mb-6">
                <button onClick={() => addToWatchlist(movie)} className="bg-green-500 text-white px-4 py-2 my-0 mx-auto rounded-lg flex items-center space-x-2 hover:bg-green-600">
                  <FaPlus /> <span> Agregar </span>
                </button>
                {/* <button onClick={() => removeFromWatchlist(movie.imdbID)} className="mt-2 mx-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600">
                  Eliminar
                </button> */}
              </div>
            </div>          
          ))}
        </div>
      )}

      {/* Navegación */}
      {movies.length > 0 && !loading && (
        <div className="flex justify-center items-center space-x-4 my-8">
          <button onClick={handlePreviousPage} className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50" disabled={currentPage === 1}>
            <FaArrowLeft />
            <span>Anterior</span>
          </button>
          <button onClick={handleNextPage} className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <FaArrowRight />
            <span>Siguiente</span>
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SearchPage;
