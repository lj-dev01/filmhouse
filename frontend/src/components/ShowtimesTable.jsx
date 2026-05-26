function ShowtimesTable({ showtimes, bookingNotice, onBookClick }) {
    return (
        <div className="available-showtimes">
            {/* Showtimes heading */}
            <h2>Available Showtimes</h2>

            {/* Booking notice */}
            {bookingNotice && (
                <p className="booking-notice">
                    {bookingNotice}
                </p>
            )}

            {/* Showtime rows */}
            {showtimes.length === 0 ? (
                <p className="no-showtimes-message">
                    No showtimes available for this movie.
                </p>
            ) : (
                <div className="showtimes-table">
                    {/* Table header */}
                    <div className="showtimes-table-header">
                        <span>Time</span>
                        <span>Screen</span>
                        <span>Price</span>
                        <span></span>
                    </div>

                    {/* Table body */}
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
                                    onClick={() => onBookClick(showtime)}
                                >
                                    Book
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ShowtimesTable;
