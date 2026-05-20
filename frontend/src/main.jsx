import React from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import "./index.css";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ShowtimesPage from "./pages/ShowtimesPage";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/my-bookings"
                      element={
                        <ProtectedRoute>
                          <MyBookingsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                </Route>
                <Route path="/showtimes/:movieId" element={<ShowtimesPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);