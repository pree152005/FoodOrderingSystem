import axios from "axios";

// Order Service - port 8081
export const orderApi = axios.create({
    baseURL: "http://localhost:8081",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Payment Service - port 8080
export const paymentApi = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Generic response error logger, kept lightweight so callers
// can still catch and handle errors with their own UI logic.
function attachLogger(instance, label) {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again.";
            console.error(`[${label}] API Error:`, message);
            return Promise.reject(error);
        }
    );
}

attachLogger(orderApi, "OrderService");
attachLogger(paymentApi, "PaymentService");
