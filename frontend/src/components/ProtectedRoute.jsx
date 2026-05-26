import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    // User auth guard
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
