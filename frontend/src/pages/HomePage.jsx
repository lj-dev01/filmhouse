import { Link } from "react-router-dom";

function HomePage() {
    return (
        <main className="home-page">
            <section className="home-hero">
                <div className="home-hero-overlay">
                    <div className="home-hero-content">
                        <span className="home-hero-welcome">Welcome to</span>

                        <h1>FILMHOUSE</h1>

                        <div className="home-hero-divider">
                            <span></span>
                            <p>★</p>
                            <span></span>
                        </div>

                        <p>
                            Discover the latest movies
                            <br />
                            Book your seats
                        </p>

                        <Link to="/movies" className="home-hero-button">
                            View Movies
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default HomePage;