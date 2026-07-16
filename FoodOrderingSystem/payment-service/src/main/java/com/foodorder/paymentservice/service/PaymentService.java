package com.foodorder.paymentservice.service;

import com.foodorder.paymentservice.dto.PaymentRequestDTO;
import com.foodorder.paymentservice.dto.PaymentResponseDTO;

import java.util.List;

public interface PaymentService {

    PaymentResponseDTO processPayment(PaymentRequestDTO requestDTO);

    List<PaymentResponseDTO> getAllPayments();
}
