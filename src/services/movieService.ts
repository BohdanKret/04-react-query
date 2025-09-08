import axios from "axios";
import type { Movie } from "../types/movie";
const myKey = import.meta.env.VITE_API_KEY;
axios.defaults.baseURL = "https://api.themoviedb.org/3";

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface MoviesResult {
  movies: Movie[];
  totalPages: number;
}

export default async function fetchMovies(
  topic: string,
  page: number
): Promise<MoviesResult> {
  const response = await axios.get<MovieSearchResponse>("/search/movie", {
    params: {
      query: topic,
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
  });
  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
}
