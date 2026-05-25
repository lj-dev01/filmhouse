import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminMoviesTab({ onAuthRequired, onAuthExpired }) {
    const [adminMovies, setAdminMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [moviesError, setMoviesError] = useState("");
    const [moviesSuccess, setMoviesSuccess] = useState("");

    const [showAddMovieModal, setShowAddMovieModal] = useState(false);
    const [showCancelAddMoviePrompt, setShowCancelAddMoviePrompt] = useState(false);

    const [movieToDelete, setMovieToDelete] = useState(null);
    const [movieToEdit, setMovieToEdit] = useState(null);
    const [showCancelEditMoviePrompt, setShowCancelEditMoviePrompt] = useState(false);

    const emptyMovieForm = {
        title: "",
        genre: "",
        age_rating: "",
        duration_minutes: "",
        description: "",
        release_date: "",
        poster_url: "",
    };

    const [newMovie, setNewMovie] = useState(emptyMovieForm);
    const [editMovie, setEditMovie] = useState(emptyMovieForm);

    function clearMovieMessages() {
        setMoviesError("");
        setMoviesSuccess("");
    }

    function scrollToTop() {
        if (typeof window !== "undefined" && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (moviesSuccess || moviesError) {
            const timer = setTimeout(() => {
                clearMovieMessages();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [moviesSuccess, moviesError]);

    useEffect(() => {
        async function fetchAdminMovies() {
            try {
                setLoadingMovies(true);

                const response = await api.get("/movies/");
                setAdminMovies(response.data);
            } catch (error) {
                setMoviesError("Failed to load movies");
            } finally {
                setLoadingMovies(false);
            }
        }

        fetchAdminMovies();
    }, []);

    function handleNewMovieChange(event) {
        const { name, value } = event.target;
        setNewMovie({ ...newMovie, [name]: value });
    }

    function handleEditMovieChange(event) {
        const { name, value } = event.target;
        setEditMovie({ ...editMovie, [name]: value });
    }

    async function handleAddMovie(event) {
        event.preventDefault();
        clearMovieMessages();

        const token = localStorage.getItem("token");

        if (!token) {
            onAuthRequired?.();
            return;
        }

        try {
            const response = await api.post(
                "/movies/",
                {
                    ...newMovie,
                    duration_minutes: Number(newMovie.duration_minutes),
                    poster_url: newMovie.poster_url || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAdminMovies((currentMovies) => [...currentMovies, response.data]);
            setNewMovie(emptyMovieForm);
            setShowAddMovieModal(false);
            setMoviesSuccess("Movie added successfully");
            scrollToTop();
        } catch (error) {
            const detail = error.response?.data?.detail || "";

            if (error.response?.status === 401 || detail.toLowerCase().includes("token")) {
                onAuthExpired?.();
                return;
            }

            setMoviesError(
                detail || "Failed to add movie. Please try again"
            );
            scrollToTop();
        }
    }

    function handleEditMovieClick(movie) {
        clearMovieMessages();

        setMovieToEdit(movie);
        setEditMovie({
            title: movie.title,
            genre: movie.genre,
            age_rating: movie.age_rating,
            duration_minutes: movie.duration_minutes,
            description: movie.description,
            release_date: movie.release_date,
            poster_url: movie.poster_url || "",
        });
    }

    async function handleUpdateMovie(event) {
        event.preventDefault();
        clearMovieMessages();

        const token = localStorage.getItem("token");

        if (!token) {
            onAuthRequired?.();
            return;
        }

        try {
            const response = await api.put(
                `/movies/${movieToEdit.id}`,
                {
                    ...editMovie,
                    duration_minutes: Number(editMovie.duration_minutes),
                    poster_url: editMovie.poster_url || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAdminMovies((currentMovies) =>
                currentMovies.map((movie) =>
                    movie.id === movieToEdit.id ? response.data : movie
                )
            );

            setMovieToEdit(null);
            setMoviesSuccess("Movie updated successfully");
            scrollToTop();
        } catch (error) {
            const detail = error.response?.data?.detail || "";

            if (error.response?.status === 401 || detail.toLowerCase().includes("token")) {
                onAuthExpired?.();
                return;
            }

            setMoviesError(
                detail || "Failed to update movie. Please try again"
            );
            scrollToTop();
        }
    }

    function handleDeleteMovieClick(movie) {
        clearMovieMessages();
        setMovieToDelete(movie);
    }

    async function confirmDeleteMovie() {
        clearMovieMessages();

        const token = localStorage.getItem("token");

        if (!token) {
            onAuthRequired?.();
            return;
        }

        try {
            await api.delete(`/movies/${movieToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAdminMovies((currentMovies) =>
                currentMovies.filter((movie) => movie.id !== movieToDelete.id)
            );

            setMovieToDelete(null);
            setMoviesSuccess("Movie deleted successfully");
            scrollToTop();
        } catch (error) {
            const detail = error.response?.data?.detail || "";

            if (error.response?.status === 401 || detail.toLowerCase().includes("token")) {
                onAuthExpired?.();
                setMovieToDelete(null);
                return;
            }

            setMoviesError(
                detail || "Failed to delete movie. Please try again"
            );

            setMovieToDelete(null);
            scrollToTop();
        }
    }

    function discardAddMovieForm() {
        setNewMovie(emptyMovieForm);
        setShowAddMovieModal(false);
        setShowCancelAddMoviePrompt(false);
    }

    function discardEditMovieForm() {
        setMovieToEdit(null);
        setShowCancelEditMoviePrompt(false);
    }

    return (
        <>
            <div>
                <div className="admin-section-header">
                    <div>
                        <h2>All Movies</h2>
                        <p>View and manage all movies in the system</p>
                    </div>

                    <button
                        className="admin-add-button"
                        onClick={() => {
                            clearMovieMessages();
                            setShowAddMovieModal(true);
                        }}
                    >
                        + Add Movie
                    </button>
                </div>

                {loadingMovies && <p>Loading movies...</p>}
                {moviesSuccess && <div className="success-message">{moviesSuccess}</div>}
                {moviesError && <div className="error-message">{moviesError}</div>}

                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Genre</th>
                                <th>Age Rating</th>
                                <th>Duration</th>
                                <th>Release Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {adminMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.title}</td>
                                    <td>{movie.genre}</td>
                                    <td>{movie.age_rating}</td>
                                    <td>{movie.duration_minutes} mins</td>
                                    <td>
                                        {new Date(movie.release_date).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td>
                                        <div className="admin-action-buttons">
                                            <button
                                                className="admin-edit-button"
                                                onClick={() => handleEditMovieClick(movie)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="confirm-cancel-booking-button admin-delete-button"
                                                onClick={() => handleDeleteMovieClick(movie)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddMovieModal && (
                <div className="cancel-booking-overlay">
                    <div className="admin-movie-modal">
                        <h2>Add Movie</h2>

                        <form className="admin-movie-form" onSubmit={handleAddMovie}>
                            <input name="title" placeholder="Title" value={newMovie.title} onChange={handleNewMovieChange} required />
                            <input name="genre" placeholder="Genre" value={newMovie.genre} onChange={handleNewMovieChange} required />
                            <input name="age_rating" placeholder="Age Rating" value={newMovie.age_rating} onChange={handleNewMovieChange} required />
                            <input name="duration_minutes" type="number" placeholder="Duration Minutes" value={newMovie.duration_minutes} onChange={handleNewMovieChange} required />
                            <input name="release_date" type="date" value={newMovie.release_date} onChange={handleNewMovieChange} required />
                            <input name="poster_url" placeholder="/posters/example.jpg" value={newMovie.poster_url} onChange={handleNewMovieChange} />
                            <textarea name="description" placeholder="Description" value={newMovie.description} onChange={handleNewMovieChange} required />

                            <div className="cancel-booking-actions">
                                <button type="submit" className="keep-booking-button">
                                    Add Movie
                                </button>

                                <button
                                    type="button"
                                    className="confirm-cancel-booking-button"
                                    onClick={() => setShowCancelAddMoviePrompt(true)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCancelAddMoviePrompt && (
                <div className="cancel-booking-overlay">
                    <div className="cancel-booking-modal">
                        <h2>Discard Movie?</h2>
                        <p>Are you sure you want to discard this movie form?</p>
                        <p>Any entered information will be lost.</p>

                        <div className="cancel-booking-actions">
                            <button
                                className="confirm-cancel-booking-button"
                                onClick={discardAddMovieForm}
                            >
                                Yes, Discard
                            </button>

                            <button
                                className="keep-booking-button"
                                onClick={() => setShowCancelAddMoviePrompt(false)}
                            >
                                Continue Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {movieToDelete && (
                <div className="cancel-booking-overlay">
                    <div className="cancel-booking-modal">
                        <h2>Delete Movie?</h2>

                        <p>Deleting this movie will also remove its showtimes.</p>
                        <p>Any existing bookings for this movie will be marked as cancelled.</p>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{movieToDelete.title}</strong>?
                        </p>

                        <div className="cancel-booking-actions">
                            <button
                                className="confirm-cancel-booking-button"
                                onClick={confirmDeleteMovie}
                            >
                                Yes, Delete Movie
                            </button>

                            <button
                                className="keep-booking-button"
                                onClick={() => setMovieToDelete(null)}
                            >
                                Keep Movie
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {movieToEdit && (
                <div className="cancel-booking-overlay">
                    <div className="admin-movie-modal">
                        <h2>Edit Movie</h2>

                        <form className="admin-movie-form" onSubmit={handleUpdateMovie}>
                            <input name="title" placeholder="Title" value={editMovie.title} onChange={handleEditMovieChange} required />
                            <input name="genre" placeholder="Genre" value={editMovie.genre} onChange={handleEditMovieChange} required />
                            <input name="age_rating" placeholder="Age Rating" value={editMovie.age_rating} onChange={handleEditMovieChange} required />
                            <input name="duration_minutes" type="number" placeholder="Duration Minutes" value={editMovie.duration_minutes} onChange={handleEditMovieChange} required />
                            <input name="release_date" type="date" value={editMovie.release_date} onChange={handleEditMovieChange} required />
                            <input name="poster_url" placeholder="/posters/example.jpg" value={editMovie.poster_url} onChange={handleEditMovieChange} />
                            <textarea name="description" placeholder="Description" value={editMovie.description} onChange={handleEditMovieChange} required />

                            <div className="cancel-booking-actions">
                                <button type="submit" className="keep-booking-button">
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    className="confirm-cancel-booking-button"
                                    onClick={() => setShowCancelEditMoviePrompt(true)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCancelEditMoviePrompt && (
                <div className="cancel-booking-overlay">
                    <div className="cancel-booking-modal">
                        <h2>Discard Changes?</h2>
                        <p>Are you sure you want to discard your movie changes?</p>
                        <p>Any unsaved edits will be lost.</p>

                        <div className="cancel-booking-actions">
                            <button
                                className="confirm-cancel-booking-button"
                                onClick={discardEditMovieForm}
                            >
                                Yes, Discard Changes
                            </button>

                            <button
                                className="keep-booking-button"
                                onClick={() => setShowCancelEditMoviePrompt(false)}
                            >
                                Continue Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminMoviesTab;