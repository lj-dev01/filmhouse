import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminBookingsTab from "../components/admin/AdminBookingsTab";
import AdminMoviesTab from "../components/admin/AdminMoviesTab";
import AdminShowtimesTab from "../components/admin/AdminShowtimesTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import {
    clearAuthToken,
    getAuthToken,
    isAuthError,
    isValidAdminToken,
    SESSION_EXPIRED_MESSAGE,
} from "../services/auth";

// Build dashboard state for auth redirects
function createRedirectSession(message) {
    return {
        ready: false,
        message,
        redirectTo: "/login",
    };
}

// Check admin access when the dashboard first loads
function getInitialAdminSession() {
    const token = getAuthToken();

    if (!token) {
        return createRedirectSession(
            "Login required. Please log in to access the admin dashboard"
        );
    }

    if (!isValidAdminToken()) {
        clearAuthToken();

        return createRedirectSession(SESSION_EXPIRED_MESSAGE);
    }

    return {
        ready: true,
        message: "",
        redirectTo: "",
    };
}

function AdminDashboardPage() {
    // Dashboard tab state
    const [activeTab, setActiveTab] = useState("bookings");
    const [adminSession, setAdminSession] = useState(getInitialAdminSession);
    const navigate = useNavigate();

    // Admin auth feedback
    const handleAuthExpired = useCallback(() => {
        clearAuthToken();
        setAdminSession(createRedirectSession(SESSION_EXPIRED_MESSAGE));
    }, []);

    const handleAdminApiError = useCallback((error) => {
        if (isAuthError(error)) {
            handleAuthExpired();
            return true;
        }

        if (error.response?.status === 403) {
            handleAuthExpired();
            return true;
        }

        return false;
    }, [handleAuthExpired]);

    // Check auth before switching tabs or opening admin modals
    function ensureAdminSession() {
        if (!isValidAdminToken()) {
            handleAuthExpired();
            return false;
        }

        return true;
    }

    function handleTabChange(nextTab) {
        if (!ensureAdminSession()) {
            return;
        }

        setActiveTab(nextTab);
    }

    function handleAdminAction() {
        return ensureAdminSession();
    }

    // Redirect after dashboard-level auth messages
    useEffect(() => {
        if (adminSession.redirectTo) {
            const timer = setTimeout(() => {
                navigate(adminSession.redirectTo);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [adminSession.redirectTo, navigate]);

    return (
        <section className="admin-dashboard-page">
            {/* Dashboard header */}
            <div className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage FilmHouse system data</p>
            </div>

            {/* Admin auth message */}
            {adminSession.message && (
                <div className="admin-section-messages">
                    <div className="error-message">{adminSession.message}</div>
                </div>
            )}

            {adminSession.ready && (
                <>
                    {/* Dashboard tabs */}
                    <div className="admin-dashboard-tabs">
                        <button
                            className={activeTab === "bookings" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                            onClick={() => handleTabChange("bookings")}
                        >
                            Bookings
                        </button>

                        <button
                            className={activeTab === "movies" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                            onClick={() => handleTabChange("movies")}
                        >
                            Movies
                        </button>

                        <button
                            className={activeTab === "showtimes" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                            onClick={() => handleTabChange("showtimes")}
                        >
                            Showtimes
                        </button>

                        <button
                            className={activeTab === "users" ? "admin-dashboard-tab active" : "admin-dashboard-tab"}
                            onClick={() => handleTabChange("users")}
                        >
                            Users
                        </button>
                    </div>

                    {/* Dashboard tab content */}
                    <div className="admin-dashboard-content">
                        {activeTab === "bookings" && (
                            <AdminBookingsTab
                                onAdminAction={handleAdminAction}
                                onAdminApiError={handleAdminApiError}
                            />
                        )}
                        {activeTab === "movies" && (
                            <AdminMoviesTab
                                onAdminAction={handleAdminAction}
                                onAdminApiError={handleAdminApiError}
                            />
                        )}
                        {activeTab === "showtimes" && (
                            <AdminShowtimesTab
                                onAdminAction={handleAdminAction}
                                onAdminApiError={handleAdminApiError}
                            />
                        )}
                        {activeTab === "users" && (
                            <AdminUsersTab
                                onAdminApiError={handleAdminApiError}
                            />
                        )}
                    </div>
                </>
            )}
        </section>
    );
}

export default AdminDashboardPage;
