import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import placeholder from '../assets/placeholder.svg';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMovies = async (page = 1) => {
    setError('');
    setMovies([]);
    setSuccess('');

    if (!query.trim()) {
      setError('Ingresa una película para buscar en la base de datos.');
      return;
    }

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=1b3bb8c1&s=${query}&page=${page}`
      );
      const data = await response.json();
      
      if (data.Response === 'False') {
        setError(data.Error || 'No se encontraron resultados.');
      } else {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults, 10));
        // console.log(data);
      }
    } catch (err) {
      setError('An error occurred while fetching data:' + err.message);
    }
  };

  const addToWatchlist = (movie) => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isAlreadyAdded = watchlist.find((m) => m.imdbID === movie.imdbID);

    if (!isAlreadyAdded) {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setSuccess(`${movie.Title} fue agregada a tu Watchlist!`);
    } else {
      setError(`${movie.Title} ya se encuentra en tu Watchlist.`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalResults / 10)) {
      setCurrentPage(currentPage + 1);
      fetchMovies(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchMovies(currentPage - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        {/* <h1 className="text-2xl font-bold">filmFinder</h1> */}
        <article className='flex'>
          <input type="text" placeholder="Search for a movie" className="border p-2 rounded rounded-e-none w-full mt-4 text-black" value={query} onChange={(e) => setQuery(e.target.value)}/>
          <button onClick={() => fetchMovies(1)} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded rounded-s-none">Buscar</button>
        </article>

        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="flex flex-col movie-item border-b p-2 m-4 justify-between rounded-lg bg-gray-800 hover:bg-gray-700">
              <Link to={`/movie/${movie.imdbID}`}>
                <img src={movie.Poster !== 'N/A' ? movie.Poster : placeholder} className="w-full h-64 object-contain rounded" alt={`${movie.Title} poster`}/>
              </Link>
              <h3 className="text-lg mt-2">
                <Link to={`/movie/${movie.imdbID}`} className="hover:underline">
                  {movie.Title}
                </Link>
              </h3>
                <button onClick={() => addToWatchlist(movie)} className="bg-green-500 text-white px-2 py-1 rounded">
                  Agregar a la Watchlist
                </button>
            </div>
          ))}
        </div>

        {totalResults > 10 && (
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className={`bg-gray-500 text-white px-4 py-2 rounded ${
                currentPage === 1 && 'opacity-50 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              disabled={currentPage === Math.ceil(totalResults / 10)}
              onClick={handleNextPage}
              className={`bg-gray-500 text-white px-4 py-2 rounded ${
                currentPage === Math.ceil(totalResults / 10) && 'opacity-50 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
