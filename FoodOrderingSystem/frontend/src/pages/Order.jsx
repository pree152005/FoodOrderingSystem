import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuItemById } from "../data/menuData";
import { createOrder } from "../api/orderService";
import { useToast } from "../components/ToastContext";

export default function Order() {
    const { foodId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const foodItem = getMenuItemById(foodId);

    const [form, setForm] = useState({
        customerName: "",
        quantity: 1,
        address: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    if (!foodItem) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-circle display-4 text-muted"></i>
                <p className="mt-3">We couldn't find that dish.</p>
                <button className="btn btn-brand rounded-pill px-4" onClick={() => navigate("/menu")}>
                    Back to Menu
                </button>
            </div>
        );
    }

    const totalAmount = (foodItem.price * form.quantity).toFixed(2);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.customerName.trim()) newErrors.customerName = "Please enter your name";
        if (!form.quantity || Number(form.quantity) < 1) newErrors.quantity = "Quantity must be at least 1";
        if (!form.address.trim()) newErrors.address = "Please enter a delivery address";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                customerName: form.customerName.trim(),
                foodItem: foodItem.name,
                quantity: Number(form.quantity),
                price: foodItem.price,
                address: form.address.trim(),
            };
            const { data } = await createOrder(payload);
            localStorage.setItem("lastCustomerName", payload.customerName);
            showToast("Order placed! Redirecting to payment...", "success");
            navigate(`/payment/${data.id}`);
        } catch (err) {
            showToast(
                err.response?.data?.message || "Could not place order. Please try again.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="order-card">
                        <div className="row g-0">
                            <div className="col-md-5">
                                <img src={foodItem.image} alt={foodItem.name} className="order-food-img" />
                            </div>
                            <div className="col-md-7 p-4">
                                <h4 className="fw-bold">{foodItem.name}</h4>
                                <p className="text-muted small">{foodItem.description}</p>
                                <h5 className="text-brand fw-bold mb-4">₹{foodItem.price} / item</h5>

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Customer Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                                            name="customerName"
                                            value={form.customerName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.customerName && (
                                            <div className="invalid-feedback">{errors.customerName}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                                            name="quantity"
                                            value={form.quantity}
                                            onChange={handleChange}
                                        />
                                        {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Delivery Address</label>
                                        <textarea
                                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                            name="address"
                                            rows="2"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="House no, street, city"
                                        ></textarea>
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center bg-light-warm rounded-3 p-3 mb-4">
                                        <span className="fw-medium">Total Amount</span>
                                        <span className="fw-bold fs-4 text-brand">₹{totalAmount}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-brand w-100 rounded-pill py-2 fw-semibold"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>Place Order</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
