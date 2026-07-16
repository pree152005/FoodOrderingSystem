package com.foodorder.paymentservice.service.impl;

import com.foodorder.paymentservice.client.OrderServiceClient;
import com.foodorder.paymentservice.dto.PaymentRequestDTO;
import com.foodorder.paymentservice.dto.PaymentResponseDTO;
import com.foodorder.paymentservice.entity.Payment;
import com.foodorder.paymentservice.entity.PaymentMethod;
import com.foodorder.paymentservice.entity.PaymentStatus;
import com.foodorder.paymentservice.exception.InvalidPaymentMethodException;
import com.foodorder.paymentservice.repository.PaymentRepository;
import com.foodorder.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderServiceClient orderServiceClient;

    @Override
    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO requestDTO) {
        PaymentMethod method = parseMethod(requestDTO.getPaymentMethod());

        Payment payment = Payment.builder()
                .orderId(requestDTO.getOrderId())
                .amount(requestDTO.getAmount())
                .paymentMethod(method)
                .paymentStatus(PaymentStatus.SUCCESS)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment {} recorded for order {}", saved.getId(), saved.getOrderId());

        // Notify order-service that the order is now PAID
        orderServiceClient.updateOrderStatus(requestDTO.getOrderId(), "PAYMENT_SUCCESS");

        return mapToResponse(saved);
    }

    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentMethod parseMethod(String method) {
        try {
            return PaymentMethod.valueOf(method.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidPaymentMethodException("Invalid payment method: " + method);
        }
    }

    private PaymentResponseDTO mapToResponse(Payment payment) {
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .paymentStatus(payment.getPaymentStatus().name())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
