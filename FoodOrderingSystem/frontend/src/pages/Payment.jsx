import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../api/orderService";
import { payForOrder } from "../api/paymentService";
import { useToast } from "../components/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const PAYMENT_METHODS = [
    { id: "UPI", label: "UPI", icon: "bi-phone" },
    { id: "CARD", label: "Card", icon: "bi-credit-card-2-front" },
    { id: "CASH", label: "Cash on Delivery", icon: "bi-cash-coin" },
];

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState("UPI");
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        upiId: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getOrderById(orderId)
            .then(({ data }) => {
                if (mounted) setOrder(data);
            })
            .catch(() => {
                if (mounted) setError("We couldn't find this order.");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, [orderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    };

    const validatePayment = () => {
        const errors = {};
        if (method === "UPI") {
            if (!paymentForm.upiId.trim()) {
                errors.upiId = "Please enter your UPI ID";
            } else if (!paymentForm.upiId.includes("@")) {
                errors.upiId = "Invalid UPI ID (must contain @)";
            }
        } else if (method === "CARD") {
            const cardNoSpaces = paymentForm.cardNumber.replace(/\s/g, "");
            const cardRegex = /^\d{16}$/;
            const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
            const cvvRegex = /^\d{3}$/;

            if (!cardNoSpaces) {
                errors.cardNumber = "Please enter your card number";
            } else if (!cardRegex.test(cardNoSpaces)) {
                errors.cardNumber = "Card number must be 16 digits";
            }

            if (!paymentForm.expiryDate) {
                errors.expiryDate = "Please enter expiry date";
            } else if (!expRegex.test(paymentForm.expiryDate)) {
                errors.expiryDate = "Use MM/YY format";
            }

            if (!paymentForm.cvv) {
                errors.cvv = "Required";
            } else if (!cvvRegex.test(paymentForm.cvv)) {
                errors.cvv = "3 digits";
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePay = async () => {
        if (!order) return;
        if (!validatePayment()) return;
        setPaying(true);
        try {
            await payForOrder({
                orderId: order.id,
                amount: order.totalAmount,
                paymentMethod: method,
            });
            showToast("Payment successful!", "success");
            navigate(`/success/${order.id}`);
        } catch (err) {
            showToast(
                err.response?.data?.message || "Payment failed. Please try again.",
                "error"
            );
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <LoadingSpinner label="Loading order details..." />;

    if (error || !order) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-triangle display-4 text-warning"></i>
                <p className="mt-3">{error || "Order not found."}</p>
                <button className="btn btn-brand rounded-pill px-4" onClick={() => navigate("/menu")}>
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="payment-card">
                        <h4 className="fw-bold mb-4 text-center">Complete Your Payment</h4>

                        <div className="summary-box mb-4">
                            <div className="d-flex justify-content-between py-1">
                                <span className="text-muted">Order ID</span>
                                <span className="fw-medium">#{order.id}</span>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                                <span className="text-muted">Customer</span>
                                <span className="fw-medium">{order.customerName}</span>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                                <span className="text-muted">Food</span>
                                <span className="fw-medium">
                                    {order.foodItem} x {order.quantity}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between py-1">
                                <span className="fw-semibold">Amount to Pay</span>
                                <span className="fw-bold text-brand fs-5">₹{order.totalAmount}</span>
                            </div>
                        </div>

                         <p className="fw-medium mb-2">Select Payment Method</p>
                        <div className="row g-2 mb-4">
                            {PAYMENT_METHODS.map((m) => (
                                <div className="col-4" key={m.id}>
                                    <button
                                        type="button"
                                        className={`payment-method-tile ${method === m.id ? "active" : ""}`}
                                        onClick={() => {
                                            setMethod(m.id);
                                            setFormErrors({});
                                        }}
                                    >
                                        <i className={`bi ${m.icon}`}></i>
                                        <span>{m.label}</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Payment Fields */}
                        <div className="mb-4">
                            {method === "UPI" && (
                                <div className="card p-3 border-light bg-light-warm">
                                    <label className="form-label fw-medium small mb-1">UPI ID</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-sm ${formErrors.upiId ? "is-invalid" : ""}`}
                                        name="upiId"
                                        placeholder="e.g. username@upi"
                                        value={paymentForm.upiId}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.upiId && <div className="invalid-feedback small">{formErrors.upiId}</div>}
                                </div>
                            )}

                            {method === "CARD" && (
                                <div className="card p-3 border-light bg-light-warm">
                                    <div className="mb-2">
                                        <label className="form-label fw-medium small mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${formErrors.cardNumber ? "is-invalid" : ""}`}
                                            name="cardNumber"
                                            placeholder="1234 5678 9101 1121"
                                            maxLength="19"
                                            value={paymentForm.cardNumber}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.cardNumber && <div className="invalid-feedback small">{formErrors.cardNumber}</div>}
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-7">
                                            <label className="form-label fw-medium small mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm ${formErrors.expiryDate ? "is-invalid" : ""}`}
                                                name="expiryDate"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={paymentForm.expiryDate}
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.expiryDate && <div className="invalid-feedback small">{formErrors.expiryDate}</div>}
                                        </div>
                                        <div className="col-5">
                                            <label className="form-label fw-medium small mb-1">CVV</label>
                                            <input
                                                type="password"
                                                className={`form-control form-control-sm ${formErrors.cvv ? "is-invalid" : ""}`}
                                                name="cvv"
                                                placeholder="123"
                                                maxLength="3"
                                                value={paymentForm.cvv}
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.cvv && <div className="invalid-feedback small">{formErrors.cvv}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {method === "CASH" && (
                                <div className="card p-3 border-light bg-light text-center">
                                    <p className="mb-0 text-muted small">
                                        <i className="bi bi-info-circle me-1 text-brand"></i>
                                        No advance payment is needed. Please keep cash or your UPI app ready at the time of delivery.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            className="btn btn-brand w-100 rounded-pill py-2 fw-semibold"
                            onClick={handlePay}
                            disabled={paying}
                        >
                            {paying ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Processing Payment...
                                </>
                            ) : (
                                <>Pay Now ₹{order.totalAmount}</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
