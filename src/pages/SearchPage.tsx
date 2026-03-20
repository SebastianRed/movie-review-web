import { useState, useEffect } from 'react';
import { tmdbApi } from '../api/tmdbApi';
import type { Movie, Series } from '../types/movie';
import type { ApiError } from '../types/api';
import { useDebounce } from '../hooks/useDebounce';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieCard from '../components/movies/MovieCard';

type SearchType = 'MOVIE' | 'SERIES';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('MOVIE');
  const [results, setResults] = useState<(Movie | Series)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const performSearch = async (query: string, type: SearchType) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = type === 'MOVIE' 
        ? await tmdbApi.searchMovies(query)
        : await tmdbApi.searchSeries(query);

      setResults(response.results);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al buscar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch(debouncedSearch, searchType);
  }, [debouncedSearch, searchType]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔍 Buscar Contenido
        </h1>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar películas o series..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {/* Type Selector */}
        <div className="flex gap-3">
          <button
            onClick={() => setSearchType('MOVIE')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              searchType === 'MOVIE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Películas
          </button>
          <button
            onClick={() => setSearchType('SERIES')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              searchType === 'SERIES'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Series
          </button>
        </div>
      </div>

      {/* Results */}
      {error && <ErrorMessage message={error} />}

      {isLoading && <Loader />}

      {!isLoading && !error && searchTerm && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg">No se encontraron resultados</p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4">
            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((item) => (
              <MovieCard 
                key={item.id} 
                content={item} 
                type={searchType} 
              />
            ))}
          </div>
        </div>
      )}

      {!searchTerm && !isLoading && (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">🎬</div>
          <p className="text-gray-600 text-lg">
            Comienza escribiendo para buscar películas o series
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;