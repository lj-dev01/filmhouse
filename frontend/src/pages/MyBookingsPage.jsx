import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MyBookingCard from "../components/MyBookingCard";
import api from "../services/api";

function MyBookingsPage() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [bookingToCancel, setBookingToCancel] = useState(null);

    function handleCancelClick(booking) {
        setBookingToCancel(booking);
    }

    function closeCancelPrompt() {
        setBookingToCancel(null);
    }

    async function confirmCancelBooking() {
        const token = localStorage.getItem("token");

        try {
            await api.put(
                `/bookings/${bookingToCancel.id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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
            const detail = error.response?.data?.detail || "";

            if (
                error.response?.status === 401 ||
                detail.toLowerCase().includes("token")
            ) {
                localStorage.removeItem("token");
                setErrorMessage("Your session has expired. Redirecting to login...");

                setTimeout(() => {
                    navigate("/login");
                }, 1200);

                setBookingToCancel(null);
                return;
            }

            setErrorMessage("Failed to cancel booking. Please try again");
            setBookingToCancel(null);
        }
    }

    useEffect(() => {
        async function fetchBookings() {
            const token = localStorage.getItem("token");

            if (!token) {
                localStorage.removeItem("token");
                setErrorMessage("Login required. Redirecting to login...");

                setTimeout(() => {
                    navigate("/login");
                }, 1200);

                return;
            }

            try {
                const response = await api.get(
                    "/bookings/my-bookings",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

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
                const detail =
                    error.response?.data?.detail || "";

                if (
                    error.response?.status === 401 ||
                    detail.toLowerCase().includes("token")
                ) {
                    localStorage.removeItem("token");

                    setErrorMessage(
                        "Your session has expired. Redirecting to login..."
                    );

                    setTimeout(() => {
                        navigate("/login");
                    }, 1200);

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
                {errorMessage}
            </section>
        );
    }

    return (
        <section className="my-bookings-page">
            <div className="my-bookings-header">
                <h1>My Bookings</h1>
                <p>View and manage your cinema bookings.</p>
            </div>

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