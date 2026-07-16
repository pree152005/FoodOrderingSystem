package com.foodorder.paymentservice.controller;

import com.foodorder.paymentservice.dto.PaymentRequestDTO;
import com.foodorder.paymentservice.dto.PaymentResponseDTO;
import com.foodorder.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<PaymentResponseDTO> pay(@Valid @RequestBody PaymentRequestDTO requestDTO) {
        PaymentResponseDTO response = paymentService.processPayment(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
