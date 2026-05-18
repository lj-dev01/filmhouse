import { Link } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");

    let role = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role = payload.role;
        } catch {
            localStorage.removeItem("token");
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link">FILMHOUSE</Link>

                <Link to="/movies">Movies</Link>

                {token && role !== "admin" && (
                    <Link to="/my-bookings">My Bookings</Link>
                )}

                {token && role === "admin" && (
                    <Link to="/admin">Admin</Link>
                )}
            </div>

            <div className="navbar-right">
                {!token && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {token && (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;