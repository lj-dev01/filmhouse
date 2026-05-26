import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

function AdminShowtimesTab({ onAuthRequired, onAuthExpired }) {
    // Showtimes data state
    const modalRef = useRef(null);
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [movieShowtimes, setMovieShowtimes] = useState({});

    // Showtimes feedback state
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);
    const [showtimesError, setShowtimesError] = useState("");
    const [showtimesSuccess, setShowtimesSuccess] = useState("");

    // Showtimes modal state
    const [movieToEditShowtimes, setMovieToEditShowtimes] = useState(null);
    const [showtimeToDelete, setShowtimeToDelete] = useState(null);

    // New showtime form state
    const [newShowtime, setNewShowtime] = useState({
        screen_id: "",
        showtime_date: "",
        showtime_time: "",
        ticket_price: "",
    });

    // Showtime message helpers
    function clearShowtimeMessages() {
        setShowtimesError("");
        setShowtimesSuccess("");
    }

    // Auto-clear messages
    useEffect(() => {
        if (showtimesSuccess || showtimesError) {
            const timer = setTimeout(() => {
                clearShowtimeMessages();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [showtimesSuccess, showtimesError]);

    // Keep modal messages visible
    useEffect(() => {
        if (movieToEditShowtimes && modalRef.current && (showtimesSuccess || showtimesError)) {
            modalRef.current.scrollTop = 0;
        }
    }, [movieToEditShowtimes, showtimesSuccess, showtimesError]);

    // Load showtime data
    useEffect(() => {
        async function fetchShowtimeData() {
            try {
                setLoadingShowtimes(true);

                const moviesResponse = await api.get("/movies/");
                const screensResponse = await api.get("/screens/");

                setMovies(moviesResponse.data);
                setScreens(screensResponse.data);

                const showtimeResults = {};

                for (const movie of moviesResponse.data) {
                    const response = await api.get(`/showtimes/movie/${movie.id}`);
                    showtimeResults[movie.id] = response.data;
                }

                setMovieShowtimes(showtimeResults);
            } catch (error) {
                setShowtimesError("Failed to load showtimes.");
            } finally {
                setLoadingShowtimes(false);
            }
        }

        fetchShowtimeData();
    }, []);

    // Edit showtimes modal actions
    function handleEditShowtimesClick(movie) {
        clearShowtimeMessages();
        setMovieToEditShowtimes(movie);
        setNewShowtime({
            screen_id: "",
            showtime_date: "",
            showtime_time: "",
            ticket_price: "",
        });
    }

    function closeEditShowtimesModal() {
        setMovieToEditShowtimes(null);
        setShowtimeToDelete(null);
    }

    function handleNewShowtimeChange(event) {
        const { name, value } = event.target;

        setNewShowtime({
            ...newShowtime,
            [name]: value,
        });
    }

    // Add showtime
    async function handleAddShowtime(event) {
        event.preventDefault();
        clearShowtimeMessages();

        const token = localStorage.getItem("token");

        const selectedScreen = screens.find(
            (screen) => screen.id === Number(newShowtime.screen_id)
        );

        const startTime = `${newShowtime.showtime_date}T${newShowtime.showtime_time}:00`;

        try {
            await api.post(
                "/showtimes/",
                {
                    movie_id: movieToEditShowtimes.id,
                    screen_id: Number(newShowtime.screen_id),
                    start_time: startTime,
                    ticket_price: Number(newShowtime.ticket_price),
                    available_seats: selectedScreen.capacity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedShowtimes = await api.get(
                `/showtimes/movie/${movieToEditShowtimes.id}`
            );

            setMovieShowtimes((currentShowtimes) => ({
                ...currentShowtimes,
                [movieToEditShowtimes.id]: updatedShowtimes.data,
            }));

            setNewShowtime({
                screen_id: "",
                showtime_date: "",
                showtime_time: "",
                ticket_price: "",
            });

            setShowtimesSuccess("Showtime added successfully.");
        } catch (error) {
            setShowtimesError(
                error.response?.data?.detail ||
                    "Failed to add showtime. Please try again."
            );
        }
    }

    // Delete showtime actions
    function handleDeleteShowtimeClick(showtime) {
        clearShowtimeMessages();
        setShowtimeToDelete(showtime);
    }

    async function confirmDeleteShowtime() {
        clearShowtimeMessages();

        const token = localStorage.getItem("token");

        if (!token) {
            onAuthRequired?.();
            return;
        }

        try {
            await api.delete(`/showtimes/${showtimeToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMovieShowtimes((currentShowtimes) => ({
                ...currentShowtimes,
                [movieToEditShowtimes.id]: currentShowtimes[
                    movieToEditShowtimes.id
                ].filter((showtime) => showtime.id !== showtimeToDelete.id),
            }));

            setShowtimeToDelete(null);
            setShowtimesSuccess("Showtime removed successfully.");
        } catch (error) {
            const detail = error.response?.data?.detail || "";

            if (error.response?.status === 401 || detail.toLowerCase().includes("token")) {
                onAuthExpired?.();
                setShowtimeToDelete(null);
                return;
            }

            setShowtimesError(
                detail || "Failed to remove showtime. Please try again."
            );

            setShowtimeToDelete(null);
        }
    }

    return (
        <>
            <div>
                {/* Admin showtimes header */}
                <div className="admin-section-header">
                    <div>
                        <h2>All Showtimes</h2>
                        <p>View and manage showtimes for each movie.</p>
                    </div>
                </div>

                {loadingShowtimes && <div>Loading showtimes...</div>}

                {/* Admin showtimes table */}
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Movie</th>
                                <th>Showtimes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {movies.map((movie) => {
                                const showtimes = movieShowtimes[movie.id] || [];

                                return (
                                    <tr key={movie.id}>
                                        <td>{movie.title}</td>

                                        <td>
                                            {showtimes.length === 0 ? (
                                                <span className="admin-no-showtimes">
                                                    No showtimes
                                                </span>
                                            ) : (
                                                <div className="admin-showtimes-list">
                                                    {showtimes.map((showtime) => {
                                                        const date = new Date(
                                                            showtime.start_time
                                                        );

                                                        return (
                                                            <span
                                                                className="admin-showtime-pill"
                                                                key={showtime.id}
                                                            >
                                                                {date.toLocaleDateString("en-GB", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}{" "}
                                                                ·{" "}
                                                                {date.toLocaleTimeString("en-GB", {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}{" "}
                                                                · {showtime.screen_name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            <button
                                                className="admin-edit-button"
                                                onClick={() =>
                                                    handleEditShowtimesClick(movie)
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit showtimes modal */}
            {movieToEditShowtimes && (
                <div className="cancel-booking-overlay">
                    <div
                        ref={modalRef}
                        className="admin-movie-modal admin-showtimes-modal"
                    >
                        <h2>Manage Showtimes</h2>

                        <div className="admin-showtimes-modal-title">
                            {movieToEditShowtimes.title}
                        </div>

                        {showtimesSuccess && (
                            <div className="success-message">{showtimesSuccess}</div>
                        )}
                        {showtimesError && (
                            <div className="error-message">{showtimesError}</div>
                        )}

                        {/* Existing showtimes */}
                        <div className="admin-existing-showtimes">
                            <h3>Existing Showtimes</h3>

                            {(movieShowtimes[movieToEditShowtimes.id] || []).length ===
                            0 ? (
                                <div className="admin-no-showtimes">
                                    No showtimes have been added for this movie.
                                </div>
                            ) : (
                                (movieShowtimes[movieToEditShowtimes.id] || []).map(
                                    (showtime) => {
                                        const date = new Date(showtime.start_time);

                                        return (
                                            <div
                                                className="admin-existing-showtime-row"
                                                key={showtime.id}
                                            >
                                                <div>
                                                    <strong>
                                                        {date.toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </strong>

                                                    <span>
                                                        {date.toLocaleTimeString("en-GB", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}{" "}
                                                        · {showtime.screen_name} · £
                                                        {showtime.ticket_price}
                                                    </span>
                                                </div>

                                                <button
                                                    className="confirm-cancel-booking-button admin-delete-button"
                                                    onClick={() =>
                                                        handleDeleteShowtimeClick(showtime)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>

                        {/* Add showtime form */}
                        <form
                            className="admin-movie-form"
                            onSubmit={handleAddShowtime}
                        >
                            <h3>Add Showtime</h3>

                            <select
                                name="screen_id"
                                value={newShowtime.screen_id}
                                onChange={handleNewShowtimeChange}
                                required
                            >
                                <option value="">Select Screen</option>

                                {screens.map((screen) => (
                                    <option key={screen.id} value={screen.id}>
                                        {screen.screen_name} · {screen.screen_type}
                                    </option>
                                ))}
                            </select>

                            <input
                                name="showtime_date"
                                type="date"
                                value={newShowtime.showtime_date}
                                onChange={handleNewShowtimeChange}
                                required
                            />

                            <input
                                name="showtime_time"
                                type="time"
                                value={newShowtime.showtime_time}
                                onChange={handleNewShowtimeChange}
                                required
                            />

                            <input
                                name="ticket_price"
                                type="number"
                                step="0.01"
                                placeholder="Ticket Price"
                                value={newShowtime.ticket_price}
                                onChange={handleNewShowtimeChange}
                                required
                            />

                            <div className="cancel-booking-actions">
                                <button type="submit" className="keep-booking-button">
                                    Add Showtime
                                </button>

                                <button
                                    type="button"
                                    className="confirm-cancel-booking-button"
                                    onClick={closeEditShowtimesModal}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete showtime modal */}
            {showtimeToDelete && (
                <div className="cancel-booking-overlay">
                    <div className="cancel-booking-modal">
                        <h2>Remove Showtime?</h2>

                        <p>
                            Are you sure you want to remove this showtime?
                        </p>

                        <p>
                            Any bookings linked to this showtime may be affected.
                        </p>

                        <div className="cancel-booking-actions">
                            <button
                                className="confirm-cancel-booking-button"
                                onClick={confirmDeleteShowtime}
                            >
                                Yes, Remove Showtime
                            </button>

                            <button
                                className="keep-booking-button"
                                onClick={() => setShowtimeToDelete(null)}
                            >
                                Keep Showtime
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminShowtimesTab;
