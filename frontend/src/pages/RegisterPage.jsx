import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";


function RegisterPage() {
        // Register form state
        const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Password requirements
    const passwordValidation = {
        hasMinLength: formData.password.length >= 12,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasLowercase: /[a-z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
    };

    const navigate = useNavigate();

    // Form input handling
    function handleChange(event) {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    // Register submission
    async function handleSubmit(event) {
        event.preventDefault()

        setSuccessMessage("");
        setErrorMessage("");

        if (!formData.username && !formData.email && !formData.password) {
            setErrorMessage("Please fill in username, email and password.");
            return;
        }

        if (!formData.username) {
            setErrorMessage("Please fill in username.");
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

        if (
            !passwordValidation.hasMinLength ||
            !passwordValidation.hasUppercase ||
            !passwordValidation.hasLowercase ||
            !passwordValidation.hasNumber
        ) {
            setErrorMessage("Password does not meet all requirements.");
            return;
        }

        try {
            await api.post("/auth/register", formData);

            setSuccessMessage("Account created successfully. Redirecting to login...");

            setFormData({
                username: "",
                email: "",
                password: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (error) {
            const detail = error.response?.data?.detail

            let message = "Registration failed. Please try again"

            if (Array.isArray(detail)) {
                message = detail.map((item) => item.msg).join(", ");
            } else if (typeof detail === "string") {
                message = detail;
            }

            setErrorMessage(message);
        }
    }


    return (
        <section className="register-page">
            {/* Register card */}
            <div className="register-card">
                <h1 className="register-title">Create Account</h1>

                {/* Register form */}
                <form className="register-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

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

                    <div className="form-row password-row">
                        <label htmlFor="password">Password</label>

                        {/* Password rules */}
                        <div className="password-field-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <div className="password-rules">
                                <span className={passwordValidation.hasMinLength ? "valid" : "invalid"}>
                                    {passwordValidation.hasMinLength ? "✓" : ""}
                                    Minimum 12 characters
                                </span>

                                <span className={passwordValidation.hasUppercase ? "valid" : "invalid"}>
                                    {passwordValidation.hasUppercase ? "✓" : ""}
                                    At least 1 uppercase letter
                                </span>

                                <span className={passwordValidation.hasLowercase ? "valid" : "invalid"}>
                                    {passwordValidation.hasLowercase ? "✓" : ""}
                                    At least 1 lowercase letter
                                </span>

                                <span className={passwordValidation.hasNumber ? "valid" : "invalid"}>
                                    {passwordValidation.hasNumber ? "✓" : ""}
                                    At least 1 number
                                </span>
                            </div>
                        </div>
                    </div>

                    {successMessage && (
                        <p className="success-message">{successMessage}</p>
                    )}

                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}

                    <button type="submit" className="register-button">Register</button>
                </form>

                <p className="login-link-text">Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </section>
    );
}

export default RegisterPage;
