export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export const POSTER_SIZES = {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500",
    ORIGINAL: "original",
} as const;

export const BACKDROP_SIZES = {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
} as const;

// Endpoints del backend
export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/auth/me", // Si tienes endpoint para obtener usuario actual
    },
    REVIEWS: {
        BASE: "/reviews",
        BY_CONTENT: "/reviews/content", // GET /reviews/content?externalContentId=123&contentType=MOVIE
        MY_REVIEWS: "/reviews/my-reviews",
    },
} as const;
