import { Link } from "react-router-dom";

function BookingForm({
    selectedShowtime,
    movie,
    ticketCount,
    bookingSuccess,
    bookingError,
    onClose,
    onIncreaseTickets,
    onDecreaseTickets,
    onConfirmBooking,
}) {
    if (!selectedShowtime) return null;

    return (
        <aside className="booking-panel">
            <button className="booking-panel-close" onClick={onClose}>
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
                        onClick={onClose}
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
                            <button onClick={onDecreaseTickets}>−</button>
                            <span>{ticketCount}</span>
                            <button onClick={onIncreaseTickets}>+</button>
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
                        onClick={onConfirmBooking}
                    >
                        Confirm Booking
                    </button>

                    <button
                        className="cancel-booking-button"
                        onClick={onClose}
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
    );
}

export default BookingForm;
