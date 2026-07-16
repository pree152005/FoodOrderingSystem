import { orderApi } from "./axiosConfig";

export const createOrder = (orderPayload) => orderApi.post("/orders", orderPayload);

export const getAllOrders = () => orderApi.get("/orders");

export const getOrderById = (id) => orderApi.get(`/orders/${id}`);

export const updateOrder = (id, orderPayload) => orderApi.put(`/orders/${id}`, orderPayload);

export const deleteOrder = (id) => orderApi.delete(`/orders/${id}`);

export const getOrdersByStatus = (status) => orderApi.get(`/orders/status/${status}`);

export const getOrdersByCustomer = (customerName) =>
    orderApi.get(`/orders/customer/${encodeURIComponent(customerName)}`);

export const getOrdersByFood = (foodItem) =>
    orderApi.get(`/orders/food/${encodeURIComponent(foodItem)}`);
