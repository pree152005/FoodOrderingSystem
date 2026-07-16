import React from "react";
import { Link, useParams } from "react-router-dom";

export default function Success() {
    const { orderId } = useParams();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 text-center">
                    <div className="success-animation mb-4">
                        <svg viewBox="0 0 130 130" className="success-checkmark">
                            <circle cx="65" cy="65" r="60" className="success-circle" />
                            <path
                                d="M40 68 L58 86 L92 46"
                                fill="none"
                                className="success-check"
                            />
                        </svg>
                    </div>
                    <h2 className="fw-bold mb-2">Order Successfully Placed!</h2>
                    <p className="text-muted mb-1">Payment Successful for Order #{orderId}</p>
                    <p className="text-muted mb-4">
                        <i className="bi bi-fire text-brand me-1"></i>
                        Your food is being prepared with love. Sit tight!
                    </p>

                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                        <Link to="/history" className="btn btn-brand rounded-pill px-4 py-2 fw-semibold">
                            <i className="bi bi-truck me-2"></i>Track Order
                        </Link>
                        <Link to="/menu" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold">
                            Order More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
