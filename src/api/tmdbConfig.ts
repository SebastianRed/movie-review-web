import axios from 'axios';
import { TMDB_BASE_URL, TMDB_API_KEY } from '../utils/constants';

export const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'es-ES',
    },
    timeout: 10000,
});