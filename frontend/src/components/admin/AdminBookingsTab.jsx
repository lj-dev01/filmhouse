import { useEffect, useState } from "react";

import api from "../../services/api";

function AdminBookingsTab({ onAuthRequired, onAuthExpired }) {
    // Admin bookings state
    const [adminBookings, setAdminBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [adminError, setAdminError] = useState("");
    const [adminBookingToCancel, setAdminBookingToCancel] = useState(null);

    // Cancel booking modal actions
    function handleAdminCancelClick(booking) {
        setAdminBookingToCancel(booking);
    }

    function closeAdminCancelModal() {
        setAdminBookingToCancel(null);
    }

    // Confirm admin cancellation
    async function confirmAdminCancelBooking() {
        const token = localStorage.getItem("token");

        if (!token) {
            onAuthRequired?.();
            setAdminBookingToCancel(null);
            return;
        }

        try {
            await api.put(
                `/bookings/admin/${adminBookingToCancel.id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAdminBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === adminBookingToCancel.id
                        ? { ...booking, booking_status: "cancelled" }
                        : booking
                )
            );

            setAdminBookingToCancel(null);
        } catch (error) {
            const detail = error.response?.data?.detail || "";

            if (error.response?.status === 401 || detail.toLowerCase().includes("token")) {
                onAuthExpired?.();
                setAdminBookingToCancel(null);
                return;
            }

            setAdminError(
                detail || "Failed to cancel booking. Please try again"
            );

            setAdminBookingToCancel(null);
        }
    }

    // Load all bookings
    useEffect(() => {
        async function fetchAdminBookings() {
            const token = localStorage.getItem("token");

            if (!token) {
                onAuthRequired?.();
                return;
            }

            try {
                setLoadingBookings(true);

                const response = await api.get("/bookings/admin/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAdminBookings(response.data);
            } catch (error) {
                const detail = error.response?.data?.detail || "";

                if (error.response?.status === 401 || detail.toLowerCase().includes("token")) {
                    onAuthExpired?.();
                    return;
                }

                if (error.response?.status === 403) {
                    setAdminError("Access denied. Admin permissions are required");
                    return;
                }

                setAdminError("Failed to load admin bookings. Please try again");
            } finally {
                setLoadingBookings(false);
            }
        }

        fetchAdminBookings();
    }, []);

    return (
        <>
            <div>
                {/* Admin bookings header */}
                <div className="admin-section-header">
                    <div>
                        <h2>All Bookings</h2>
                        <p>View and manage all bookings in the system</p>
                    </div>
                </div>

                {/* Admin bookings messages */}
                {loadingBookings && <p>Loading bookings...</p>}
                {adminError && <div className="error-message">{adminError}</div>}

                {/* Admin bookings table */}
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Booking Ref</th>
                                <th>User</th>
                                <th>Movie</th>
                                <th>Showtime</th>
                                <th>Screen</th>
                                <th>Tickets</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {adminBookings.map((booking) => {
                                const showtimeDate = new Date(booking.showtime_start_time);

                                return (
                                    <tr key={booking.id}>
                                        <td>{booking.booking_reference}</td>
                                        <td>{booking.user_email}</td>
                                        <td>{booking.movie_title}</td>
                                        <td>
                                            <div className="admin-showtime-cell">
                                                <span>
                                                    {showtimeDate.toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>

                                                <small>
                                                    {showtimeDate.toLocaleTimeString("en-GB", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </small>
                                            </div>
                                        </td>
                                        <td>{booking.screen_name}</td>
                                        <td>{booking.number_of_tickets}</td>
                                        <td>
                                            <span className={`admin-status ${booking.booking_status}`}>
                                                {booking.booking_status}
                                            </span>
                                        </td>
                                        <td>
                                            {booking.booking_status === "active" ? (
                                                <button
                                                    className="admin-cancel-button"
                                                    onClick={() => handleAdminCancelClick(booking)}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button className="admin-disabled-button" disabled>
                                                    Cancelled
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin cancel booking modal */}
            {adminBookingToCancel && (
                <div className="cancel-booking-overlay">
                    <div className="cancel-booking-modal">
                        <h2>Cancel Booking?</h2>

                        <p>You are cancelling this booking on behalf of the user.</p>

                        <div className="admin-cancel-summary">
                            <p>
                                <strong>User:</strong> {adminBookingToCancel.user_email}
                            </p>

                            <p>
                                <strong>Movie:</strong> {adminBookingToCancel.movie_title}
                            </p>

                            <p>
                                <strong>Reference:</strong>{" "}
                                {adminBookingToCancel.booking_reference}
                            </p>
                        </div>

                        <div className="cancel-booking-actions">
                            <button
                                className="confirm-cancel-booking-button"
                                onClick={confirmAdminCancelBooking}
                            >
                                Yes, Cancel Booking
                            </button>

                            <button
                                className="keep-booking-button"
                                onClick={closeAdminCancelModal}
                            >
                                Keep Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminBookingsTab;
