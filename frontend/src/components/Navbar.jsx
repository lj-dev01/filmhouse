import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <h2>FILMHOUSE</h2>

            <div>
                <Link to="/">Home</Link>
                <Link to="/movies">Movies</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/my-bookings">My Bookings</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </nav>
    );
}

export default Navbar;