package com.foodorder.paymentservice.exception;

public class InvalidPaymentMethodException extends RuntimeException {
    public InvalidPaymentMethodException(String message) {
        super(message);
    }
}
