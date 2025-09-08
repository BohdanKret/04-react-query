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

export default async function fetchMovies(topic: string): Promise<Movie[]> {
    const response = await axios.get<MovieSearchResponse>("/search/movie", {
        params: {
            query: topic,
            page: 1,
        },
        headers: {
            accept: "application/json",
            Authorization:
                `Bearer ${myKey}`,
        }
    });
  return response.data.results;
}
