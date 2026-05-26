function MovieDetails({ movie }) {
    if (!movie) return null;

    return (
        <div className="showtimes-details">
            {/* Movie title */}
            <div className="showtimes-title-row">
                <h1>{movie.title}</h1>
                <span className="showtimes-age-rating">
                    {movie.age_rating}
                </span>
            </div>

            {/* Movie metadata */}
            <div className="movie-info-line">
                <span>{movie.release_date?.slice(0, 4)}</span>
                <span>•</span>
                <span>{movie.duration_minutes} mins</span>
                <span>•</span>
                <span>{movie.genre}</span>
            </div>

            {/* Movie description */}
            <p className="showtimes-description">
                <strong>Description:</strong> {movie.description}
            </p>
        </div>
    );
}

export default MovieDetails;
