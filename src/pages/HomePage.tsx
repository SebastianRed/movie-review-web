import { useState, useEffect } from 'react';
import { tmdbApi } from '../api/tmdbApi';
import type { Movie, Series } from '../types/movie';
import type { ApiError } from '../types/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieCard from '../components/movies/MovieCard';

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isLoadingSeries, setIsLoadingSeries] = useState(true);
  const [error, setError] = useState('');

  const fetchPopularContent = async () => {
    try {
      setError('');
      
      // Fetch películas populares
      const moviesResponse = await tmdbApi.getPopularMovies();
      setMovies(moviesResponse.results.slice(0, 8) as Movie[]);
      setIsLoadingMovies(false);

      // Fetch series populares
      const seriesResponse = await tmdbApi.getPopularSeries();
      setSeries(seriesResponse.results.slice(0, 8) as Series[]);
      setIsLoadingSeries(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar contenido');
      setIsLoadingMovies(false);
      setIsLoadingSeries(false);
    }
  };

  useEffect(() => {
    fetchPopularContent();
  }, []);

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPopularContent} />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bienvenido a MovieReviews
        </h1>
        <p className="text-xl text-blue-100 mb-6">
          Descubre, revisa y comparte tus opiniones sobre películas y series
        </p>
        <div className="flex gap-4">
          <a 
            href="/search"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Buscar Películas
          </a>
          <a
            href="/profile"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Mis Reviews
          </a>
        </div>
      </section>

      {/* Películas Populares */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🎬 Películas Populares
        </h2>
        
        {isLoadingMovies ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} content={movie} type="MOVIE" />
            ))}
          </div>
        )}
      </section>

      {/* Series Populares */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📺 Series Populares
        </h2>
        
        {isLoadingSeries ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {series.map((show) => (
              <MovieCard key={show.id} content={show} type="SERIES" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;