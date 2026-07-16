package com.foodorder.deliveryservice.listener;

import com.foodorder.deliveryservice.client.OrderServiceClient;
import com.foodorder.deliveryservice.dto.OrderMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryOrderListener {

    private final OrderServiceClient orderServiceClient;

    @Value("${app.delivery.dispatch-time-ms}")
    private long dispatchTimeMs;

    @Value("${app.delivery.transit-time-ms}")
    private long transitTimeMs;

    @JmsListener(destination = "${app.queue.delivery}")
    public void onOrderReadyForDelivery(OrderMessageDTO message) {
        log.info("=================================================");
        log.info("Delivery Started for Order : {}", message.getOrderId());
        log.info("Customer  : {}", message.getCustomerName());
        log.info("Address   : {}", message.getAddress());
        log.info("=================================================");

        sleep(dispatchTimeMs);

        // Mark order as OUT_FOR_DELIVERY
        orderServiceClient.updateOrderStatus(message.getOrderId(), "OUT_FOR_DELIVERY");
        log.info("Order {} is now OUT_FOR_DELIVERY", message.getOrderId());

        sleep(transitTimeMs);

        // Mark order as DELIVERED
        orderServiceClient.updateOrderStatus(message.getOrderId(), "DELIVERED");
        log.info("Order {} has been DELIVERED", message.getOrderId());
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Delivery simulation interrupted", e);
        }
    }
}
