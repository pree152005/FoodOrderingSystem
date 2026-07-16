import React from "react";

export default function LoadingSpinner({ label = "Loading..." }) {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
            <div className="spinner-border text-brand" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">{label}</span>
            </div>
            <p className="text-muted mt-3 mb-0">{label}</p>
        </div>
    );
}
