import { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import Swal from 'sweetalert2';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(storedWatchlist);
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

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Mi Watchlist</h1>
        {watchlist.length === 0 ? (
          <p className="text-center text-gray-500">Tu Watchlist está vacía. ¡Agrega películas desde la página principal!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {watchlist.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <img src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'} alt={movie.Title} className="w-full h-64 object-contain"/>
                <div className="p-4">
                  <h3 className="text-lg text-center font-bold text-black dark:text-white">{movie.Title}</h3>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">{movie.Year}</p>
                  <button onClick={() => removeFromWatchlist(movie.imdbID)} className="mt-2 mx-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600"> Eliminar </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WatchlistPage;
