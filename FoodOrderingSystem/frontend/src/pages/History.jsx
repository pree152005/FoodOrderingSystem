import React, { useEffect, useState } from "react";
import { getAllOrders, getOrdersByCustomer } from "../api/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import OrderTimeline from "../components/OrderTimeline";
import { useToast } from "../components/ToastContext";

export default function History() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState(localStorage.getItem("lastCustomerName") || "");
    const { showToast } = useToast();

    const loadOrders = async (customerName) => {
        setLoading(true);
        try {
            const { data } = customerName
                ? await getOrdersByCustomer(customerName)
                : await getAllOrders();
            setOrders(data.sort((a, b) => b.id - a.id));
        } catch (err) {
            showToast("Could not load your orders.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadOrders(search.trim());
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h1 className="section-title d-inline-block">Order History</h1>
                <p className="text-muted">Track the status of your past and current orders.</p>
            </div>

            <form className="row justify-content-center mb-5" onSubmit={handleSearch}>
                <div className="col-md-6">
                    <div className="input-group search-bar">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-person"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search by your name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-brand" type="submit">
                            Search
                        </button>
                    </div>
                </div>
            </form>

            {loading ? (
                <LoadingSpinner label="Fetching your orders..." />
            ) : orders.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-receipt display-4 text-muted"></i>
                    <p className="text-muted mt-3">No orders found yet.</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {orders.map((order) => (
                        <div className="history-card" key={order.id}>
                            <div
                                className="history-card-header"
                                onClick={() =>
                                    setExpandedId(expandedId === order.id ? null : order.id)
                                }
                            >
                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Order #{order.id} &middot; {order.foodItem}
                                    </h6>
                                    <small className="text-muted">
                                        {order.customerName} &middot; Qty {order.quantity} &middot; ₹
                                        {order.totalAmount}
                                    </small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <StatusBadge status={order.status} />
                                    <i
                                        className={`bi ${
                                            expandedId === order.id ? "bi-chevron-up" : "bi-chevron-down"
                                        }`}
                                    ></i>
                                </div>
                            </div>
                            {expandedId === order.id && (
                                <div className="history-card-body">
                                    <OrderTimeline status={order.status} />
                                    <div className="row mt-3 small text-muted">
                                        <div className="col-md-6">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {order.address}
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                            Placed on{" "}
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleString()
                                                : "—"}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
