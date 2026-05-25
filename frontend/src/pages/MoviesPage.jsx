import { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";

function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await api.get("/movies");

                setMovies(response.data);
            } catch (error) {
                setErrorMessage("Failed to load movies");
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, []);

    const visibleMovies = movies.slice(0, visibleCount);

    function handleLoadMore() {
        setVisibleCount((currentCount) => currentCount + 12);
    }

    if (loading) {
        return (
            <section className="movies-page">
                <p className="loading-message">Loading movies...</p>
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="movies-page">
                <p className="error-message">{errorMessage}</p>
            </section>
        );
    }

    return (
        <section className="movies-page">
            <div className="movies-header">
                <h1>All Movies</h1>
                <div className="header-line"></div>
            </div>

            <div className="movies-grid">
                {visibleMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            <div className="movies-footer">
                {visibleCount < movies.length ? (
                    <button
                        className="load-more-button"
                        onClick={handleLoadMore}
                    >
                        Load More Movies
                    </button>
                ) : (
                    <p className="end-message">--- End ---</p>
                )}
            </div>
        </section>
    );
}

export default MoviesPage;