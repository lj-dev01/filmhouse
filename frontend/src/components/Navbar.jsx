import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    AUTH_CHANGE_EVENT,
    clearAuthToken,
    getAuthToken,
    getTokenPayload,
} from "../services/auth";

// Read token details for navigation display
function getNavbarAuthState() {
    const token = getAuthToken();

    if (!token) {
        return {
            isLoggedIn: false,
            role: null,
        };
    }

    const payload = getTokenPayload(token);

    if (!payload) {
        return {
            isLoggedIn: false,
            role: null,
        };
    }

    return {
        isLoggedIn: true,
        role: payload.role,
    };
}

function Navbar() {
    // Authentication state
    const [authState, setAuthState] = useState(getNavbarAuthState);

    // Keep navigation in sync with login and logout changes
    useEffect(() => {
        function refreshAuthState() {
            setAuthState(getNavbarAuthState());
        }

        window.addEventListener(AUTH_CHANGE_EVENT, refreshAuthState);

        return () => {
            window.removeEventListener(AUTH_CHANGE_EVENT, refreshAuthState);
        };
    }, []);

    // Logout action
    function handleLogout() {
        clearAuthToken();
        window.location.href = "/login";
    }

    return (
        <nav className="navbar">
            {/* Primary navigation */}
            <div className="navbar-left">
                <Link to="/" className="logo-link">FILMHOUSE</Link>

                <Link to="/movies">Movies</Link>

                {authState.isLoggedIn && authState.role !== "admin" && (
                    <Link to="/my-bookings">My Bookings</Link>
                )}

                {authState.isLoggedIn && authState.role === "admin" && (
                    <Link to="/admin">Admin Dashboard</Link>
                )}
            </div>

            {/* Authentication navigation */}
            <div className="navbar-right">
                {!authState.isLoggedIn && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {authState.isLoggedIn && (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
