import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminBookingsTab from "../components/admin/AdminBookingsTab";
import AdminMoviesTab from "../components/admin/AdminMoviesTab";
import AdminShowtimesTab from "../components/admin/AdminShowtimesTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";

function AdminDashboardPage() {
    // Dashboard tab state
    const [activeTab, setActiveTab] = useState("bookings");
    const [adminAuthMessage, setAdminAuthMessage] = useState("");
    const navigate = useNavigate();

    // Admin auth feedback
    function handleAuthRequired() {
        setAdminAuthMessage("Login required. Please log in to access the admin dashboard");
    }

    function handleAuthExpired() {
        localStorage.removeItem("token");
        setAdminAuthMessage("Your session has expired. Redirecting to login...");

        setTimeout(() => {
            navigate("/login");
        }, 1200);
    }

    return (
        <section className="admin-dashboard-page">
            {/* Dashboard header */}
            <div className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage FilmHouse system data</p>
            </div>

            {/* Admin auth message */}
            {adminAuthMessage && (
                <div className="admin-section-messages">
                    <div className="error-message">{adminAuthMessage}</div>
                </div>
            )}

            {/* Dashboard tabs */}
            <div className="admin-dashboard-tabs">
                <button
                    className={activeTab === "bookings" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                    onClick={() => setActiveTab("bookings")}
                >
                    Bookings
                </button>

                <button
                    className={activeTab === "movies" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                    onClick={() => setActiveTab("movies")}
                >
                    Movies
                </button>

                <button
                    className={activeTab === "showtimes" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                    onClick={() => setActiveTab("showtimes")}
                >
                    Showtimes
                </button>

                <button
                    className={activeTab === "users" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
            </div>

            {/* Dashboard tab content */}
            <div className="admin-dashboard-content">
                {activeTab === "bookings" && (
                    <AdminBookingsTab
                        onAuthRequired={handleAuthRequired}
                        onAuthExpired={handleAuthExpired}
                    />
                )}
                {activeTab === "movies" && (
                    <AdminMoviesTab
                        onAuthRequired={handleAuthRequired}
                        onAuthExpired={handleAuthExpired}
                    />
                )}
                {activeTab === "showtimes" && (
                    <AdminShowtimesTab
                        onAuthRequired={handleAuthRequired}
                        onAuthExpired={handleAuthExpired}
                    />
                )}
                {activeTab === "users" && (
                    <AdminUsersTab
                        onAuthRequired={handleAuthRequired}
                        onAuthExpired={handleAuthExpired}
                    />
                )}
            </div>
        </section>
    );
}

export default AdminDashboardPage;
