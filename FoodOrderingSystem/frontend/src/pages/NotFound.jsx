import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container py-5">
            <div className="text-center py-5">
                <h1 className="display-1 fw-bold text-brand">404</h1>
                <h4 className="fw-bold mb-2">Oops! Page not found</h4>
                <p className="text-muted mb-4">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-brand rounded-pill px-4 py-2 fw-semibold">
                    <i className="bi bi-house-door me-2"></i>Back to Home
                </Link>
            </div>
        </div>
    );
}
