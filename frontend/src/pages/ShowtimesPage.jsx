import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function ShowtimesPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [bookingSuccess, setBookingSuccess] = useState("");
    const [bookingError, setBookingError] = useState("");
    const [bookingNotice, setBookingNotice] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const movieResponse = await api.get(`/movies/${movieId}`);
                const showtimesResponse = await api.get(`/showtimes/movie/${movieId}`);

                setMovie(movieResponse.data);
                setShowtimes(showtimesResponse.data);
            } catch (error) {
                setErrorMessage("Failed to load showtimes.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [movieId]);

    function handleBookClick(showtime) {
        const token = localStorage.getItem("token");

        if (!token) {
            setBookingNotice("Login required. Please log in to proceed with booking.");
            return;
        }

        setSelectedShowtime(showtime);
        setTicketCount(1);
        setBookingSuccess("");
        setBookingError("");
        setBookingNotice("");
    }

    function closeBookingPanel() {
        setSelectedShowtime(null);
        setTicketCount(1);
        setBookingSuccess("");
        setBookingError("");
    }

    function increaseTickets() {
        setTicketCount((current) => current + 1);
    }

    function decreaseTickets() {
        setTicketCount((current) => Math.max(1, current - 1));
    }

    async function handleConfirmBooking() {
        setBookingSuccess("");
        setBookingError("");

        try {
            const response = await api.post(
                "/bookings/",
                {
                    showtime_id: selectedShowtime.id,
                    number_of_tickets: ticketCount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setBookingSuccess(response.data.booking_reference);

            const updatedShowtimes = await api.get(`/showtimes/movie/${movieId}`);
            setShowtimes(updatedShowtimes.data);
        } catch (error) {
            const message = error.response?.data?.detail || "Booking failed. Please try again.";

            if (
                error.response?.status === 401 ||
                message.toLowerCase().includes("token")
            ) {
                localStorage.removeItem("token");
                setBookingError("Your session has expired. Redirecting to login...");

                setTimeout(() => {
                    navigate("/login");
                }, 1200);

                return;
            }

            setBookingError(message);
        }
    }

    if (loading) {
        return <section className="showtimes-page">Loading showtimes...</section>;
    }

    if (errorMessage) {
        return <section className="showtimes-page">{errorMessage}</section>;
    }

    return (
        <section className="showtimes-page">
            <Link to="/movies" className="back-link">
                ← Back to Movies
            </Link>

            <div className="showtimes-layout">
                <div className="showtimes-poster-wrapper">
                    {movie?.poster_url ? (
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="showtimes-poster"
                        />
                    ) : (
                        <div className="showtimes-poster-placeholder">
                            {movie?.title}
                        </div>
                    )}
                </div>

                <div className="showtimes-main-content">
                    <div className="showtimes-details">
                        <div className="showtimes-title-row">
                            <h1>{movie?.title}</h1>
                            <span className="showtimes-age-rating">
                                {movie?.age_rating}
                            </span>
                        </div>

                        <div className="movie-info-line">
                            <span>{movie?.release_date?.slice(0, 4)}</span>
                            <span>•</span>
                            <span>{movie?.duration_minutes} mins</span>
                            <span>•</span>
                            <span>{movie?.genre}</span>
                        </div>

                        <p className="showtimes-description">
                            <strong>Description:</strong> {movie?.description}
                        </p>
                    </div>

                    <div className="available-showtimes">
                        <h2>Available Showtimes</h2>

                        {bookingNotice && (
                            <p className="booking-notice">
                                {bookingNotice}
                            </p>
                        )}

                        {showtimes.length === 0 ? (
                            <p className="no-showtimes-message">
                                No showtimes available for this movie.
                            </p>
                        ) : (
                            <div className="showtimes-table">
                                <div className="showtimes-table-header">
                                    <span>Time</span>
                                    <span>Screen</span>
                                    <span>Price</span>
                                    <span></span>
                                </div>

                                {showtimes.map((showtime) => {
                                    const date = new Date(showtime.start_time);

                                    return (
                                        <div
                                            className="showtimes-table-row"
                                            key={showtime.id}
                                        >
                                            <div>
                                                <p className="showtime-main">
                                                    {date.toLocaleTimeString("en-GB", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>

                                                <p className="showtime-sub">
                                                    {date.toLocaleDateString("en-GB", {
                                                        weekday: "short",
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="showtime-main">
                                                    {showtime.screen_type}
                                                </p>

                                                <p className="showtime-sub">
                                                    {showtime.screen_name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="showtime-price">
                                                    £{showtime.ticket_price}
                                                </p>

                                                <p className="showtime-sub">
                                                    {showtime.available_seats} seats available
                                                </p>
                                            </div>

                                            <button
                                                className="book-now-button"
                                                onClick={() => handleBookClick(showtime)}
                                            >
                                                Book
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedShowtime && (
                <aside className="booking-panel">
                    <button className="booking-panel-close" onClick={closeBookingPanel}>
                        ×
                    </button>

                    {bookingSuccess ? (
                        <div className="booking-success-panel">
                            <h2>Booking Confirmed</h2>

                            <p className="booking-success-text">
                                Your booking has been successfully created.
                            </p>

                            <div className="booking-reference-box">
                                <span>Booking Reference</span>
                                <strong>{bookingSuccess}</strong>
                            </div>

                            <Link to="/my-bookings" className="confirm-booking-button">
                                View My Bookings
                            </Link>

                            <button
                                className="cancel-booking-button"
                                onClick={closeBookingPanel}
                            >
                                Continue Browsing
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2>Book Showtime</h2>

                            <div className="booking-summary">
                                <h3>{movie?.title}</h3>

                                <p>
                                    <strong>Screen:</strong>{" "}
                                    {selectedShowtime.screen_name} · {selectedShowtime.screen_type}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(selectedShowtime.start_time).toLocaleDateString(
                                        "en-GB",
                                        {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {new Date(selectedShowtime.start_time).toLocaleTimeString(
                                        "en-GB",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </p>

                                <p>
                                    <strong>Ticket Price:</strong> £
                                    {selectedShowtime.ticket_price}
                                </p>
                            </div>

                            <div className="ticket-selector">
                                <p>Select Number of Tickets</p>

                                <div className="ticket-controls">
                                    <button onClick={decreaseTickets}>−</button>
                                    <span>{ticketCount}</span>
                                    <button onClick={increaseTickets}>+</button>
                                </div>

                                <p className="ticket-availability">
                                    {selectedShowtime.available_seats} seats available
                                </p>
                            </div>

                            <div className="booking-total">
                                <span>Total</span>
                                <strong>
                                    £
                                    {(ticketCount * selectedShowtime.ticket_price).toFixed(2)}
                                </strong>
                            </div>

                            <button
                                className="confirm-booking-button"
                                onClick={handleConfirmBooking}
                            >
                                Confirm Booking
                            </button>

                            <button
                                className="cancel-booking-button"
                                onClick={closeBookingPanel}
                            >
                                Cancel
                            </button>

                            {bookingError && (
                                <p className="error-message">
                                    {bookingError}
                                </p>
                            )}
                        </>
                    )}
                </aside>
            )}
        </section>
    );
}

export default ShowtimesPage;