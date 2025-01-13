import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=1b3bb8c1&i=${id}`);
        const data = await response.json();

        if (data.Response === 'False') {
          setError(data.Error || 'No se encontraron detalles para esta película.');
        } else {
          setMovie(data);
        }
      } catch (err) {
        setError('Error al obtener los detalles: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="p-8">
        <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">
          Volver
        </button>
        <div className="flex flex-col lg:flex-row gap-6">
          <img src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'} alt={movie.Title} className="w-full lg:w-1/3 h-96 object-contain rounded-lg"/>
          <div>
            <h1 className="text-3xl font-bold text-gray-500 dark:text-white">{movie.Title}</h1>
            <p className="text-gray-500 dark:text-white mt-2">{movie.Year}</p>
            <p className="mt-4 text-gray-500 dark:text-white">{movie.Plot}</p>
            <p className="mt-4 text-gray-500 dark:text-white">
              <span className="font-bold">Género:</span> {movie.Genre}
            </p>
            <p className="text-gray-500 dark:text-white">
              <span className="font-bold">Director:</span> {movie.Director}
            </p>
            <p className="text-gray-500 dark:text-white">
              <span className="font-bold">Actores:</span> {movie.Actors}
            </p>
            <p className="text-gray-500 dark:text-white">
              <span className="font-bold">Idioma:</span> {movie.Language}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
