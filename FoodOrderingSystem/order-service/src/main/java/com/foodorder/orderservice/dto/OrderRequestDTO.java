package com.foodorder.orderservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must not exceed 100 characters")
    private String customerName;

    @NotBlank(message = "Food item is required")
    @Size(max = 100, message = "Food item must not exceed 100 characters")
    private String foodItem;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private Double price;

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
}
