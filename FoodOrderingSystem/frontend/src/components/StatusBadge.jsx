import React from "react";

const STATUS_CONFIG = {
    PLACED: { color: "secondary", icon: "bi-receipt", label: "Placed" },
    PAYMENT_PENDING: { color: "secondary", icon: "bi-hourglass-split", label: "Payment Pending" },
    PAYMENT_SUCCESS: { color: "primary", icon: "bi-credit-card", label: "Paid" },
    KITCHEN_PREPARING: { color: "warning", icon: "bi-fire", label: "Preparing" },
    FOOD_READY: { color: "info", icon: "bi-bag-check", label: "Food Ready" },
    OUT_FOR_DELIVERY: { color: "orange", icon: "bi-bicycle", label: "Out for Delivery" },
    DELIVERED: { color: "success", icon: "bi-check-circle", label: "Delivered" },
    CANCELLED: { color: "danger", icon: "bi-x-circle", label: "Cancelled" },
};

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
        <span className={`status-badge status-${config.color}`}>
            <i className={`bi ${config.icon} me-1`}></i>
            {config.label}
        </span>
    );
}

export { STATUS_CONFIG };
