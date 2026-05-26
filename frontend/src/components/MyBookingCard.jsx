function MyBookingCard({ booking, onCancelClick }) {
    return (
        <article className="my-booking-card">
            {/* Booking details */}
            <div className="my-booking-card-main">
                <div className="my-booking-card-title-row">
                    <h2>{booking.movieTitle}</h2>

                    <span className={`my-booking-status ${booking.status}`}>
                        {booking.status}
                    </span>
                </div>

                <div className="my-booking-details-grid">
                    <p>{booking.date}</p>
                    <p>{booking.time}</p>
                    <p>{booking.screen}</p>
                    <p>{booking.ticketCount} ticket(s)</p>
                </div>
            </div>

            {/* Booking reference */}
            <div className="my-booking-reference-section">
                <span>Booking Reference</span>
                <strong>{booking.reference}</strong>
            </div>

            {/* Booking actions */}
            <div className="my-booking-card-actions">
                {booking.status === "active" ? (
                    <button
                        className="my-booking-cancel-button"
                        onClick={() => onCancelClick(booking)}
                    >
                        Cancel Booking
                    </button>
                ) : (
                    <button className="my-booking-cancelled-button" disabled>
                        Cancelled
                    </button>
                )}
            </div>
        </article>
    );
}

export default MyBookingCard;
