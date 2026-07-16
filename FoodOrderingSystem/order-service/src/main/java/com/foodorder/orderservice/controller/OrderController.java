package com.foodorder.orderservice.controller;

import com.foodorder.orderservice.dto.OrderRequestDTO;
import com.foodorder.orderservice.dto.OrderResponseDTO;
import com.foodorder.orderservice.dto.StatusUpdateDTO;
import com.foodorder.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO requestDTO) {
        OrderResponseDTO response = orderService.createOrder(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateOrder(@PathVariable Long id,
                                                          @Valid @RequestBody OrderRequestDTO requestDTO) {
        return ResponseEntity.ok(orderService.updateOrder(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @GetMapping("/customer/{customerName}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByCustomer(@PathVariable String customerName) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerName));
    }

    @GetMapping("/food/{foodItem}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByFood(@PathVariable String foodItem) {
        return ResponseEntity.ok(orderService.getOrdersByFood(foodItem));
    }

    /**
     * Internal endpoint used by Payment, Kitchen and Delivery services
     * to update the order status as it progresses through the workflow.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long id,
                                                                @Valid @RequestBody StatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusUpdateDTO.getStatus()));
    }
}
