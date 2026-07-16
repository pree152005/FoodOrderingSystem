import React from "react";

const STEPS = [
    { key: "PAYMENT_PENDING", label: "Placed", icon: "bi-receipt" },
    { key: "PAYMENT_SUCCESS", label: "Paid", icon: "bi-credit-card" },
    { key: "KITCHEN_PREPARING", label: "Preparing", icon: "bi-fire" },
    { key: "FOOD_READY", label: "Ready", icon: "bi-bag-check" },
    { key: "OUT_FOR_DELIVERY", label: "On the Way", icon: "bi-bicycle" },
    { key: "DELIVERED", label: "Delivered", icon: "bi-check-circle" },
];

export default function OrderTimeline({ status }) {
    let activeIndex = 0;
    if (status === "PAYMENT_PENDING" || status === "PLACED") {
        activeIndex = 0;
    } else if (status === "PAYMENT_SUCCESS") {
        activeIndex = 1;
    } else if (status === "KITCHEN_PREPARING") {
        activeIndex = 2;
    } else if (status === "FOOD_READY") {
        activeIndex = 3;
    } else if (status === "OUT_FOR_DELIVERY") {
        activeIndex = 4;
    } else if (status === "DELIVERED") {
        activeIndex = 5;
    } else if (status === "CANCELLED") {
        activeIndex = -1;
    }

    return (
        <div className="order-timeline">
            {STEPS.map((step, index) => {
                const isDone = index < activeIndex;
                const isActive = index === activeIndex;
                return (
                    <div
                        key={step.key}
                        className={`timeline-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                    >
                        <div className="timeline-icon">
                            <i className={`bi ${step.icon}`}></i>
                        </div>
                        <span className="timeline-label">{step.label}</span>
                        {index < STEPS.length - 1 && <div className="timeline-connector"></div>}
                    </div>
                );
            })}
        </div>
    );
}
