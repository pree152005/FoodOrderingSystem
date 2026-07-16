import React from "react";
import { useNavigate } from "react-router-dom";

export default function FoodCard({ item }) {
    const navigate = useNavigate();

    return (
        <div className="col-6 col-md-4 col-lg-3">
            <div className="food-card h-100">
                <div className="food-card-img-wrap">
                    <img src={item.image} alt={item.name} className="food-card-img" loading="lazy" />
                    {item.badge && <span className="badge-pill">{item.badge}</span>}
                    <span className="rating-pill">
                        <i className="bi bi-star-fill me-1"></i>{item.rating}
                    </span>
                </div>
                <div className="p-3 d-flex flex-column">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted small mb-2 food-desc">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold text-brand fs-5">₹{item.price}</span>
                        <button
                            className="btn btn-brand btn-sm rounded-pill px-3"
                            onClick={() => navigate(`/order/${item.id}`)}
                        >
                            <i className="bi bi-plus-lg me-1"></i>Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
