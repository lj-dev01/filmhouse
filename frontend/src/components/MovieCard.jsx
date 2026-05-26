import { Link } from "react-router-dom";

function MovieCard({ movie }) {
    return (
        <article className="movie-card">
            {/* Movie poster */}
            <div className="movie-poster-wrapper">
                {movie.poster_url ? (
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="movie-poster"
                    />
                ) : (
                    <div className="movie-poster-placeholder">
                        <span>{movie.title}</span>
                    </div>
                )}
            </div>

            {/* Movie summary */}
            <div className="movie-card-content">
                <h2>{movie.title}</h2>

                <p className="movie-genre">
                    {movie.genre}
                </p>

                <div className="movie-meta">
                    <span>{movie.duration_minutes} mins</span>
                    <span>{movie.age_rating}</span>
                </div>

                <Link to={`/showtimes/${movie.id}`} className="showtimes-button">
                    View Showtimes
                </Link>
            </div>
        </article>
    );
}

export default MovieCard;
