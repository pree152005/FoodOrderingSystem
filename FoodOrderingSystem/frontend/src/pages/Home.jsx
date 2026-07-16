import React from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menuData";
import FoodCard from "../components/FoodCard";

const CATEGORY_TILES = [
    { name: "Biryani", icon: "bi-egg-fried", filter: "biryani" },
    { name: "Pizza", icon: "bi-circle", filter: "pizza" },
    { name: "Burgers", icon: "bi-app", filter: "burgers" },
    { name: "Desserts", icon: "bi-cup-hot", filter: "desserts" },
    { name: "Beverages", icon: "bi-cup-straw", filter: "beverages" },
];

export default function Home() {
    const featured = menuItems.filter((i) => i.badge).slice(0, 4);
    const popular = [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, 4);

    return (
        <>
            {/* Hero Banner */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center min-vh-hero">
                        <div className="col-lg-6">
                            <span className="hero-eyebrow">🔥 Fastest Delivery in Town</span>
                            <h1 className="hero-title">
                                Craving something <span className="text-brand">delicious?</span>
                            </h1>
                            <p className="hero-subtitle">
                                Order from your favorite restaurants and get piping-hot food
                                delivered to your doorstep in under 30 minutes.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/menu" className="btn btn-brand btn-lg rounded-pill px-4">
                                    <i className="bi bi-basket3 me-2"></i>Order Now
                                </Link>
                                <Link to="/menu" className="btn btn-outline-dark btn-lg rounded-pill px-4">
                                    View Menu
                                </Link>
                            </div>
                            <div className="d-flex gap-4 mt-5">
                                <div>
                                    <h3 className="fw-bold mb-0">500+</h3>
                                    <small className="text-muted">Dishes</small>
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-0">50k+</h3>
                                    <small className="text-muted">Happy Customers</small>
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-0">30 min</h3>
                                    <small className="text-muted">Avg. Delivery</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center mt-5 mt-lg-0">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700"
                                alt="Delicious food spread"
                                className="hero-img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-5">
                <div className="container">
                    <h2 className="section-title">Explore Categories</h2>
                    <div className="row g-3 mt-2">
                        {CATEGORY_TILES.map((cat) => (
                            <div className="col-6 col-md-4 col-lg-2" key={cat.name}>
                                <Link
                                    to={`/menu?category=${cat.filter}`}
                                    className="category-tile text-decoration-none"
                                >
                                    <i className={`bi ${cat.icon}`}></i>
                                    <span>{cat.name}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers */}
            <section className="py-4">
                <div className="container">
                    <div className="offer-banner">
                        <div>
                            <h3 className="fw-bold text-white mb-1">Flat 20% OFF</h3>
                            <p className="text-white-50 mb-0">On your first order above ₹299. Use code WELCOME20</p>
                        </div>
                        <Link to="/menu" className="btn btn-light rounded-pill fw-semibold px-4">
                            Order Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Foods */}
            <section className="py-5">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="section-title mb-0">Featured Foods</h2>
                        <Link to="/menu" className="text-brand fw-semibold text-decoration-none">
                            See all <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                    <div className="row g-4 mt-2">
                        {featured.map((item) => (
                            <FoodCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Items */}
            <section className="py-5 bg-light-warm">
                <div className="container">
                    <h2 className="section-title">Popular Right Now</h2>
                    <div className="row g-4 mt-2">
                        {popular.map((item) => (
                            <FoodCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
