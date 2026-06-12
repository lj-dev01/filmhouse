import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clearAuthToken, isValidUserToken } from "../services/auth";

function ProtectedRoute({ children }) {
    // User auth guard
    const navigate = useNavigate();
    const hasValidSession = isValidUserToken();

    useEffect(() => {
        if (!hasValidSession) {
            clearAuthToken();

            const timer = setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2200);

            return () => clearTimeout(timer);
        }
    }, [hasValidSession, navigate]);

    if (!hasValidSession) {
        return (
            <section className="my-bookings-page">
                <div className="error-message">
                    Login required. Redirecting to login...
                </div>
            </section>
        );
    }

    return children;
}

export default ProtectedRoute;
