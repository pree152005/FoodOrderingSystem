package com.foodorder.kitchenservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

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
