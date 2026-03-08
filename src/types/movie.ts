export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genres?: Genre[];
}

export interface Series {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genres?: Genre[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface TMDBSearchResponse {
    page: number;
    results: Movie[] | Series[];
    total_pages: number;
    total_results: number;
}