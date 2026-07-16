package com.foodorder.kitchenservice.listener;

import com.foodorder.kitchenservice.client.OrderServiceClient;
import com.foodorder.kitchenservice.dto.OrderMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KitchenOrderListener {

    private final JmsTemplate jmsTemplate;
    private final OrderServiceClient orderServiceClient;

    @Value("${app.queue.delivery}")
    private String deliveryQueue;

    @Value("${app.kitchen.cooking-time-ms}")
    private long cookingTimeMs;

    @JmsListener(destination = "${app.queue.order}")
    public void onOrderReceived(OrderMessageDTO message) {
        log.info("=================================================");
        log.info("Received Order : {}", message.getOrderId());
        log.info("Customer       : {}", message.getCustomerName());
        log.info("Food Item      : {} x {}", message.getFoodItem(), message.getQuantity());
        log.info("=================================================");

        // Mark order as KITCHEN_PREPARING
        orderServiceClient.updateOrderStatus(message.getOrderId(), "KITCHEN_PREPARING");
        log.info("Order {} is now KITCHEN_PREPARING", message.getOrderId());

        // Simulate cooking time
        sleep(cookingTimeMs);

        // Mark order as FOOD_READY
        orderServiceClient.updateOrderStatus(message.getOrderId(), "FOOD_READY");
        log.info("Order {} is now FOOD_READY", message.getOrderId());

        // Forward the order to the delivery queue
        jmsTemplate.convertAndSend(deliveryQueue, message);
        log.info("Order {} forwarded to delivery queue [{}]", message.getOrderId(), deliveryQueue);
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Cooking simulation interrupted", e);
        }
    }
}
