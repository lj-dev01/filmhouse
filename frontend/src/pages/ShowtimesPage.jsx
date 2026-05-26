import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import MovieDetails from "../components/MovieDetails";
import ShowtimesTable from "../components/ShowtimesTable";
import BookingForm from "../components/BookingForm";

function ShowtimesPage() {
    // Route data
    const { movieId } = useParams();
    const navigate = useNavigate();

    // Movie and showtime state
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Booking state
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [bookingError, setBookingError] = useState("");
    const [bookingNotice, setBookingNotice] = useState("");

    // Current user role
    const token = localStorage.getItem("token");
    let userRole = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userRole = payload.role;
        } catch {
            localStorage.removeItem("token");
        }
    }

    const isAdmin = userRole === "admin";

    // Load movie and showtimes
    useEffect(() => {
        async function fetchData() {
            try {
                const movieResponse = await api.get(`/movies/${movieId}`);
                const showtimesResponse = await api.get(`/showtimes/movie/${movieId}`);

                setMovie(movieResponse.data);
                setShowtimes(showtimesResponse.data);
            } catch (error) {
                setErrorMessage("Failed to load showtimes");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [movieId]);

    // Booking panel actions
    function handleBookClick(showtime) {
        const token = localStorage.getItem("token");

        if (isAdmin) {
            setBookingNotice("Admins cannot make bookings from this page. Log in as a regular user to book tickets.");
            return;
        }

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

    // Confirm booking
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
            const message = error.response?.data?.detail || "Booking failed. Please try again";

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

    // Loading and error states
    if (loading) {
        return <section className="showtimes-page">Loading showtimes...</section>;
    }

    if (errorMessage) {
        return <section className="showtimes-page">{errorMessage}</section>;
    }

    return (
        <section className="showtimes-page">
            {/* Back navigation */}
            <Link to="/movies" className="back-link">
                ← Back to Movies
            </Link>

            {/* Showtimes layout */}
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
                    <MovieDetails movie={movie} />

                    <ShowtimesTable
                        showtimes={showtimes}
                        bookingNotice={bookingNotice}
                        isAdmin={isAdmin}
                        onBookClick={handleBookClick}
                    />
                </div>
            </div>

            {/* Booking form */}
            <BookingForm
                selectedShowtime={selectedShowtime}
                movie={movie}
                ticketCount={ticketCount}
                bookingSuccess={bookingSuccess}
                bookingError={bookingError}
                onClose={closeBookingPanel}
                onIncreaseTickets={increaseTickets}
                onDecreaseTickets={decreaseTickets}
                onConfirmBooking={handleConfirmBooking}
            />
        </section>
    );
}

export default ShowtimesPage;
