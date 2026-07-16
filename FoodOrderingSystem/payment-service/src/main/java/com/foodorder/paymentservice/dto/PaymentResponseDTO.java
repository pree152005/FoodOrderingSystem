package com.foodorder.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {

    private Long id;
    private Long orderId;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
}
