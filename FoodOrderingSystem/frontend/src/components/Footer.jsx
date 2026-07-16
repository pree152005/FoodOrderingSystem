import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer-custom pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-md-4">
                        <h4 className="fw-bold text-white mb-3">
                            <i className="bi bi-egg-fried me-2 text-brand"></i>
                            FoodieExpress
                        </h4>
                        <p className="text-secondary-light">
                            Delicious food, delivered fast. From your favorite local
                            kitchens straight to your door.
                        </p>
                        <div className="d-flex gap-3 fs-5">
                            <a href="#!" className="text-white"><i className="bi bi-facebook"></i></a>
                            <a href="#!" className="text-white"><i className="bi bi-instagram"></i></a>
                            <a href="#!" className="text-white"><i className="bi bi-twitter-x"></i></a>
                            <a href="#!" className="text-white"><i className="bi bi-youtube"></i></a>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <h6 className="text-white fw-semibold mb-3">Explore</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/menu" className="footer-link">Menu</Link></li>
                            <li><Link to="/history" className="footer-link">My Orders</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h6 className="text-white fw-semibold mb-3">Categories</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><span className="footer-link">Biryani</span></li>
                            <li><span className="footer-link">Pizza</span></li>
                            <li><span className="footer-link">Burgers</span></li>
                            <li><span className="footer-link">Desserts</span></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h6 className="text-white fw-semibold mb-3">Contact</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 text-secondary-light">
                            <li><i className="bi bi-geo-alt me-2"></i>Bengaluru, India</li>
                            <li><i className="bi bi-telephone me-2"></i>+91 98765 43210</li>
                            <li><i className="bi bi-envelope me-2"></i>support@foodieexpress.com</li>
                        </ul>
                    </div>
                </div>

                <hr className="border-secondary my-4" />
                <p className="text-center text-secondary-light mb-0 small">
                    &copy; {new Date().getFullYear()} FoodieExpress. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
