package com.foodorder.orderservice.entity;

/**
 * Represents the lifecycle of an order across all microservices.
 */
public enum OrderStatus {
    PLACED,
    PAYMENT_PENDING,
    PAYMENT_SUCCESS,
    KITCHEN_PREPARING,
    FOOD_READY,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}
