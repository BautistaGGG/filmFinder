import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import Rating from '../assets/star.png'

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=1b3bb8c1&i=${id}`);
        const data = await response.json();

        if (data.Response === 'False') {
          setError(data.Error || 'Detalles de la película no encontrados.');
        } else {
          setMovie(data);
          console.log(data);
        }
      } catch (err) {
        setError('Hubo un error al recibir los datos.' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <Navbar />
        <div className="text-white text-center">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Navbar />
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Volver
        </button>
        <div className="flex flex-col lg:flex-row gap-4">
          <img src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'} className="w-full lg:w-1/3 h-96 object-contain rounded-lg" alt={`${movie.Title} poster`}/>
          <div>
            <h1 className="text-3xl font-bold">{movie.Title}</h1>
            <p className="text-gray-400 mt-2">{movie.Year}</p>
            <p className="mt-4">{movie.Plot}</p>
            <p className="mt-4">
              <span className="font-bold">Género:</span> {movie.Genre}
            </p>
            <p>
              <span className="font-bold">Director:</span> {movie.Director}
            </p>
            <p>
              <span className="font-bold">Actores:</span> {movie.Actors}
            </p>
            <p>
              <span className="font-bold">{movie.Language.length > 1 && (<span>Lenguajes:</span>)} {movie.Language.length < 1 && (<span> Lenguaje: </span>)}</span> {movie.Language}
            </p>
            <p>
              <span className="font-bold">Ratings:</span>{' '}
              {movie.Ratings.map((rating) => (
                <span key={rating.Source} className="block">
                  {rating.Source}: <img src={Rating} className='inline'/> {rating.Value}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
