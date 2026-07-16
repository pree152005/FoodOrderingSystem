package com.foodorder.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {

    private Long id;
    private String customerName;
    private String foodItem;
    private Integer quantity;
    private Double price;
    private Double totalAmount;
    private String address;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
