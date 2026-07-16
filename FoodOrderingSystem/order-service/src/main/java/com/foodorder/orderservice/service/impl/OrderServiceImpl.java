package com.foodorder.orderservice.service.impl;

import com.foodorder.orderservice.dto.OrderMessageDTO;
import com.foodorder.orderservice.dto.OrderRequestDTO;
import com.foodorder.orderservice.dto.OrderResponseDTO;
import com.foodorder.orderservice.entity.Order;
import com.foodorder.orderservice.entity.OrderStatus;
import com.foodorder.orderservice.exception.InvalidStatusException;
import com.foodorder.orderservice.exception.ResourceNotFoundException;
import com.foodorder.orderservice.jms.OrderQueueProducer;
import com.foodorder.orderservice.repository.OrderRepository;
import com.foodorder.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderQueueProducer orderQueueProducer;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO requestDTO) {
        Order order = Order.builder()
                .customerName(requestDTO.getCustomerName())
                .foodItem(requestDTO.getFoodItem())
                .quantity(requestDTO.getQuantity())
                .price(requestDTO.getPrice())
                .address(requestDTO.getAddress())
                .status(OrderStatus.PAYMENT_PENDING)
                .build();

        Order saved = orderRepository.save(order);
        log.info("Order created with id {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO getOrderById(Long id) {
        Order order = findOrderOrThrow(id);
        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrder(Long id, OrderRequestDTO requestDTO) {
        Order order = findOrderOrThrow(id);
        order.setCustomerName(requestDTO.getCustomerName());
        order.setFoodItem(requestDTO.getFoodItem());
        order.setQuantity(requestDTO.getQuantity());
        order.setPrice(requestDTO.getPrice());
        order.setAddress(requestDTO.getAddress());
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = findOrderOrThrow(id);
        orderRepository.delete(order);
        log.info("Order {} deleted", id);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByStatus(String status) {
        OrderStatus orderStatus = parseStatus(status);
        return orderRepository.findByStatus(orderStatus)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByCustomer(String customerName) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(customerName)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByFood(String foodItem) {
        return orderRepository.findByFoodItemContainingIgnoreCase(foodItem)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long id, String status) {
        Order order = findOrderOrThrow(id);
        OrderStatus newStatus = parseStatus(status);
        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        log.info("Order {} status updated to {}", id, newStatus);
        
        if (newStatus == OrderStatus.PAYMENT_SUCCESS) {
            OrderMessageDTO message = new OrderMessageDTO(
                    updated.getId(),
                    updated.getCustomerName(),
                    updated.getFoodItem(),
                    updated.getQuantity(),
                    updated.getAddress()
            );
            orderQueueProducer.sendOrderToKitchen(message);
        }
        
        return mapToResponse(updated);
    }

    private Order findOrderOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private OrderStatus parseStatus(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidStatusException("Invalid order status: " + status);
        }
    }

    private OrderResponseDTO mapToResponse(Order order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .foodItem(order.getFoodItem())
                .quantity(order.getQuantity())
                .price(order.getPrice())
                .totalAmount(order.getPrice() * order.getQuantity())
                .address(order.getAddress())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
