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
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

function App() {
  // for search
  const [topic, setTopic] = useState<string>("");
  //for modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  // for pagination
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", topic, page],
    queryFn: () => fetchMovies(topic, page),
    enabled: topic !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newTopic: string) => {
    setTopic(newTopic);
    setPage(1);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  // Показати toast, якщо не знайдено фільмів
  useEffect(() => {
    if (isSuccess && data && data.movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const isMoviesArray = data && data.movies.length > 0;
  const isNotOnlyOnePage = data && data.totalPages > 1;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isMoviesArray && (
        <MovieGrid movies={data.movies} onSelect={setSelectedMovie} />
      )}
      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={handleModalClose} movie={selectedMovie} />
      )}
      <Toaster position="top-center" />
      {isMoviesArray && isNotOnlyOnePage && !isLoading && (
        <ReactPaginate
          pageCount={data.totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </div>
  );
}

export default App;
