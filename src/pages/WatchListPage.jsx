import { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import Swal from 'sweetalert2';
import filmIcon from '../assets/IconDark.png';
import starIcon from '../assets/star.png';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
      const updatedWatchlist = await Promise.all(
        storedWatchlist.map(async (movie) => {
          try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=1b3bb8c1&i=${movie.imdbID}`);
            const data = await response.json();
            return data.Response === 'True' ? data : movie;
          } catch (error) {
            console.error(`Error fetching details for ${movie.imdbID}:`, error);
            return movie;
          }
        })
      );
      setWatchlist(updatedWatchlist);
      setLoading(false);
      console.log(updatedWatchlist);
    };

    fetchWatchlistDetails();
  }, []);

  const removeFromWatchlist = (imdbID) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar esta película de tu Watchlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedWatchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        Swal.fire('Eliminado', 'La película ha sido eliminada de tu Watchlist.', 'success');
      }
    });
  };

  const clearWatchlist = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todas las películas de tu Watchlist.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setWatchlist([]);
        localStorage.removeItem('watchlist');
        Swal.fire('Watchlist limpia', 'Se han eliminado todas las películas de tu Watchlist.', 'success');
      }
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center my-6 text-gray-800 dark:text-white">Mi Watchlist</h1>
        {watchlist.length === 0 ? (
          <>
          <img src={filmIcon} className='block my-6 mx-auto'/> 
          <p className="text-xl my-6 text-center text-gray-500">Tu Watchlist está vacía. ¡Agrega películas desde la página principal!</p>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {watchlist.map((movie) => (
                <div key={movie.imdbID} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col justify-between h-full">
                  <div className="p-4 flex flex-col">
                    <img src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'} alt={movie.Title} className="w-40 h-56 object-contain rounded-lg"/>
                    <div className='flex flex-row justify-center items-center'>
                      <h3 className="text-lg font-bold text-center text-black dark:text-white">{movie.Title}</h3>
                      <div className='flex flex-row justify-center items-center ml-2'>
                        <img src={starIcon} />
                        <p className="text-sm text-center pl-1 text-gray-600 dark:text-gray-400"> {movie.imdbRating || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">{movie.Genre}</p>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400"> {movie.Runtime}</p>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">{movie.Plot}</p>
                  </div>
                  <div className="mt-auto">
                    <button onClick={() => removeFromWatchlist(movie.imdbID)} className="mt-2 mx-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600">
                      Eliminar
                    </button>
                  </div>
                </div> 
              ))}
            </div>

            

            <div className="flex justify-center mt-8">
              <button onClick={clearWatchlist} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"> Limpiar Watchlist </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WatchlistPage;
