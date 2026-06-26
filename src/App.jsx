import React, { useEffect, useState, useRef } from 'react';
import { useDebounce } from "@uidotdev/usehooks";
import Search from './Components/Search';
import MovieCard from './Components/MovieCard';
import Spinner from './Spinner';
import { updateSearchCount, getTrendingMovies } from './appwrite';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cacheRef = useRef(new Map());

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchMovies = async (rawQuery) => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return;

    setIsLoading(true);
    setErrorMessage('');

    // 1. Serve from cache if we've already fetched this exact query

    if (cacheRef.current.has(query)) {
      const cached = cacheRef.current.get(query);

      if (cached.data.length === 0) {
        setMovieList([]);
        setErrorMessage(cached.error || 'No movies found');
      } else {
        setMovieList(cached.data);
      }

      setIsLoading(false);
      return; // no OMDb call, no Appwrite call 
    }

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      console.log("OMDB Response:", data);

      if (data.Response === 'False') {
        setMovieList([]);
        setErrorMessage(data.Error || 'No movies found');

        // Cache the "no results" outcome too — stops repeated typos
        // or revisits from burning another OMDb call.

        cacheRef.current.set(query, {
          data: [],
          error: data.Error || 'No movies found',
          loggedToAppwrite: true, // nothing to log for a failed search
        });

        return;
      }

      const results = data.Search || [];
      setMovieList(results);

      // 2. Store result in cache immediately, before the Appwrite call,

      cacheRef.current.set(query, {
        data: results,
        error: null,
        loggedToAppwrite: false,
      });

      // 3. Log to Appwrite once per query per session, then mark it done.

      if (results.length > 0) {
        await updateSearchCount(query, results[0]);
        cacheRef.current.get(query).loggedToAppwrite = true;
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error(
        "Error fetching trending movies:",
        error
      );
    }
  };

  // Initial Load
  useEffect(() => {
    fetchMovies('oppenheimer');
    loadTrendingMovies();
  }, []);

  // Search Effect
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) return;

    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Logo" />

          <h1>
            Find <span className="text-gradient">Movies</span> you will Enjoy
            without the Hassle
          </h1>

          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>

                  <img
                    src={movie.poster_url}
                    alt={movie.searchTerm}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">
              {errorMessage}
            </p>
          ) : (
            <ul>
              {movieList.map((movie, index) => (
                <li key={movie.imdbID}>
                  <MovieCard
                    movie={movie}
                    index={index}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;