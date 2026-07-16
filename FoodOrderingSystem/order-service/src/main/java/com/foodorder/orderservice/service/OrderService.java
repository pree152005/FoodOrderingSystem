package com.foodorder.orderservice.service;

import com.foodorder.orderservice.dto.OrderRequestDTO;
import com.foodorder.orderservice.dto.OrderResponseDTO;

import java.util.List;

public interface OrderService {

    OrderResponseDTO createOrder(OrderRequestDTO requestDTO);

    List<OrderResponseDTO> getAllOrders();

    OrderResponseDTO getOrderById(Long id);

    OrderResponseDTO updateOrder(Long id, OrderRequestDTO requestDTO);

    void deleteOrder(Long id);

    List<OrderResponseDTO> getOrdersByStatus(String status);

    List<OrderResponseDTO> getOrdersByCustomer(String customerName);

    List<OrderResponseDTO> getOrdersByFood(String foodItem);

    OrderResponseDTO updateOrderStatus(Long id, String status);
}
