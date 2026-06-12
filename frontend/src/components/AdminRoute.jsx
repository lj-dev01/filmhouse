import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clearAuthToken, isValidAdminToken, SESSION_EXPIRED_MESSAGE } from "../services/auth";

function AdminRoute({ children }) {
    // Admin auth guard
    const navigate = useNavigate();
    const hasValidAdminSession = isValidAdminToken();

    useEffect(() => {
        if (!hasValidAdminSession) {
            clearAuthToken();

            const timer = setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2200);

            return () => clearTimeout(timer);
        }
    }, [hasValidAdminSession, navigate]);

    if (!hasValidAdminSession) {
        return (
            <section className="admin-dashboard-page">
                <div className="admin-section-messages">
                    <div className="error-message">
                        {SESSION_EXPIRED_MESSAGE}
                    </div>
                </div>
            </section>
        );
    }

    return children;
}

export default AdminRoute;
