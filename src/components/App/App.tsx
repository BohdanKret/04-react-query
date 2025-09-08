import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { type Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topic, setTopic] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (newTopic: string) => {
    setTopic(newTopic);
    setMovies([]);
    setIsError(false);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!topic) return;

    async function fetchData() {
      try {
        setIsError(false);
        setIsLoading(true);
        const data = await fetchMovies(topic);
        if (data.length === 0) {
          toast.error("No movies found for your request.");
          return;
        }
        setMovies((prevMovies) => [...prevMovies, ...data]);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [topic]);

  const isMouviesArray = movies.length > 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isMouviesArray && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={handleModalClose} movie={selectedMovie} />
      )}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
