import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";


function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!formData.email && !formData.password) {
            setErrorMessage("Please fill in email and password.");
            return;
        }

        if (!formData.email) {
            setErrorMessage("Please fill in email.");
            return;
        }

        if (!formData.password) {
            setErrorMessage("Please fill in password.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        try {
            const response = await api.post("/auth/login", formData);

            localStorage.setItem("token", response.data.access_token);

            setSuccessMessage("Successfully logged in. Redirecting to home page...");

            setTimeout(() => {
                window.location.href = "/";
            }, 1200);
        } catch (error) {
            setErrorMessage("Email or password is invalid.");
        }
    }

    return (
        <section className="login-page">
            <div className="login-card">
                <h1 className="login-title">Login</h1>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="login-button">Login</button>
                </form>

                <p className="login-link-text">Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </section>
    );
}

export default LoginPage;