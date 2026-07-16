package com.foodorder.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Lightweight payload sent over ActiveMQ queues between
 * Order -> Kitchen -> Delivery services.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderMessageDTO implements Serializable {

    private Long orderId;
    private String customerName;
    private String foodItem;
    private Integer quantity;
    private String address;
}
