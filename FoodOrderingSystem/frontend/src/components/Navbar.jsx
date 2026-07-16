import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const linkClass = ({ isActive }) =>
        "nav-link px-3 fw-medium " + (isActive ? "active-link" : "");

    return (
        <nav className="navbar navbar-expand-lg sticky-top navbar-custom">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-3" to="/">
                    <i className="bi bi-egg-fried me-2"></i>
                    Foodie<span className="text-dark">Express</span>
                </NavLink>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    aria-label="Toggle navigation"
                >
                    <i className="bi bi-list fs-1"></i>
                </button>

                <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/" onClick={() => setExpanded(false)} end>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/menu" onClick={() => setExpanded(false)}>
                                Menu
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/history" onClick={() => setExpanded(false)}>
                                My Orders
                            </NavLink>
                        </li>
                        <li className="nav-item ms-lg-2">
                            <button
                                className="btn btn-brand rounded-pill px-4 fw-semibold"
                                onClick={() => {
                                    setExpanded(false);
                                    navigate("/menu");
                                }}
                            >
                                <i className="bi bi-bag-check me-1"></i> Order Now
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
