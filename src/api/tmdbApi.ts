import { tmdbClient } from './tmdbConfig';
import type { Movie, Series, TMDBSearchResponse, Genre } from '../types/movie';

export const tmdbApi = {
  // Buscar películas
  searchMovies: async (query: string, page: number = 1): Promise<TMDBSearchResponse> => {
    const { data } = await tmdbClient.get<TMDBSearchResponse>('/search/movie', {
      params: { query, page }
    });
    return data;
  },

  // Buscar series
  searchSeries: async (query: string, page: number = 1): Promise<TMDBSearchResponse> => {
    const { data } = await tmdbClient.get<TMDBSearchResponse>('/search/tv', {
      params: { query, page }
    });
    return data;
  },

  // Obtener detalle de película
  getMovieDetails: async (movieId: number): Promise<Movie> => {
    const { data } = await tmdbClient.get<Movie>(`/movie/${movieId}`);
    return data;
  },

  // Obtener detalle de serie
  getSeriesDetails: async (seriesId: number): Promise<Series> => {
    const { data } = await tmdbClient.get<Series>(`/tv/${seriesId}`);
    return data;
  },

  // Películas populares (para homepage)
  getPopularMovies: async (page: number = 1): Promise<TMDBSearchResponse> => {
    const { data } = await tmdbClient.get<TMDBSearchResponse>('/movie/popular', {
      params: { page }
    });
    return data;
  },

  // Series populares
  getPopularSeries: async (page: number = 1): Promise<TMDBSearchResponse> => {
    const { data } = await tmdbClient.get<TMDBSearchResponse>('/tv/popular', {
      params: { page }
    });
    return data;
  },
};

// Helper para construir URLs de imágenes
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-image.png'; // Imagen por defecto
  return `https://image.tmdb.org/t/p/${size}${path}`;
};