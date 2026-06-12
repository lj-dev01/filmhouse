import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MyBookingCard from "../components/MyBookingCard";
import api from "../services/api";
import {
    clearAuthToken,
    isAuthError,
    isValidUserToken,
    SESSION_EXPIRED_MESSAGE,
} from "../services/auth";

// Show the session message before sending the user back to login
function redirectToLogin(navigate, setErrorMessage) {
    clearAuthToken();
    setErrorMessage(SESSION_EXPIRED_MESSAGE);

    setTimeout(() => {
        navigate("/login");
    }, 2000);
}

function MyBookingsPage() {
    const navigate = useNavigate();

    // Booking list state
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [bookingToCancel, setBookingToCancel] = useState(null);

    // Cancel booking actions
    function handleCancelClick(booking) {
        if (!isValidUserToken()) {
            redirectToLogin(navigate, setErrorMessage);
            return;
        }

        setBookingToCancel(booking);
    }

    function closeCancelPrompt() {
        setBookingToCancel(null);
    }

    async function confirmCancelBooking() {
        try {
            await api.put(
                `/bookings/${bookingToCancel.id}/cancel`,
                {}
            );

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === bookingToCancel.id
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );

            setBookingToCancel(null);
        } catch (error) {
            if (isAuthError(error)) {
                redirectToLogin(navigate, setErrorMessage);
                setBookingToCancel(null);
                return;
            }

            setErrorMessage("Failed to cancel booking. Please try again");
            setBookingToCancel(null);
        }
    }

    // Load user bookings
    useEffect(() => {
        async function fetchBookings() {
            if (!isValidUserToken()) {
                redirectToLogin(navigate, setErrorMessage);
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/bookings/my-bookings");

                const formattedBookings = response.data.map((booking) => {
                    const showtimeDate = new Date(
                        booking.showtime_start_time
                    );

                    return {
                        id: booking.id,
                        movieTitle: booking.movie_title,
                        date: showtimeDate.toLocaleDateString(
                            "en-GB",
                            {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            }
                        ),
                        time: showtimeDate.toLocaleTimeString(
                            "en-GB",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        ),
                        screen: `${booking.screen_name} · ${booking.screen_type}`,
                        ticketCount: booking.number_of_tickets,
                        reference: booking.booking_reference,
                        status: booking.booking_status,
                    };
                });

                setBookings(formattedBookings);
            } catch (error) {
                if (isAuthError(error)) {
                    redirectToLogin(navigate, setErrorMessage);
                    return;
                }

                setErrorMessage(
                    "Failed to load bookings. Please try again"
                );
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();

    }, [navigate]);

    if (loading) {
        return (
            <section className="my-bookings-page">Loading bookings...</section>
        );
    }

    if (errorMessage) {
        return (
            <section className="my-bookings-page">
                <div className="error-message">{errorMessage}</div>
            </section>
        );
    }

    return (
        <section className="my-bookings-page">
            {/* Bookings header */}
            <div className="my-bookings-header">
                <h1>My Bookings</h1>
                <p>View and manage your cinema bookings.</p>
            </div>

            {/* Bookings list */}
            <div className="my-bookings-list">
                {bookings.length === 0 ? (
                    <p className="no-bookings-message">You have no bookings yet.</p>
                ) : (
                    bookings.map((booking) => (
                        <MyBookingCard
                            key={booking.id}
                            booking={booking}
                            onCancelClick={handleCancelClick}
                        />
                    ))
                )}
            </div>

            {/* Cancel booking modal */}
            {bookingToCancel && (
                <div className="cancel-booking-overlay">
                    <div className="cancel-booking-modal">
                        <h2>Cancel Booking?</h2>

                        <p>
                            Are you sure you want to cancel your booking for{" "}
                            <strong>{bookingToCancel.movieTitle}</strong>?
                        </p>

                        <p className="cancel-booking-reference">
                            Reference: {bookingToCancel.reference}
                        </p>

                        <div className="cancel-booking-actions">
                            <button className="confirm-cancel-booking-button" onClick={confirmCancelBooking}>
                                Yes, Cancel Booking
                            </button>

                            <button
                                className="keep-booking-button"
                                onClick={closeCancelPrompt}
                            >
                                Keep Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default MyBookingsPage;
