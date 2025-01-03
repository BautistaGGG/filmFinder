import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../componentes/Navbar';
import placeholder from '../assets/placeholder.svg';

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
  
        Swal.fire({
          title: 'Eliminada!',
          text: 'La película ha sido eliminada de tu Watchlist.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    });
  };
  

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        {watchlist.length === 0 ? (
          <p className="text-gray-500 mt-4">Tu watchList está vacía. Agrega algunas películas!</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.imdbID} className="border p-4 bg-gray-800 rounded-lg hover:bg-gray-700">
                <img src={movie.Poster !== 'N/A' ? movie.Poster : placeholder} className="w-full h-64 object-contain rounded-md mb-2" alt={`${movie.Title} poster`}/>
                <h3 className="text-lg font-bold">{movie.Title}</h3>
                <p className="text-sm text-gray-400">{movie.Year}</p>
                <button onClick={() => removeFromWatchlist(movie.imdbID)} className="bg-red-500 text-white px-2 py-1 rounded mt-2">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WatchlistPage;
