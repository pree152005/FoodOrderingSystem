package com.foodorder.orderservice.repository;

import com.foodorder.orderservice.entity.Order;
import com.foodorder.orderservice.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);

    List<Order> findByFoodItemContainingIgnoreCase(String foodItem);

    List<Order> findByStatus(OrderStatus status);
}
