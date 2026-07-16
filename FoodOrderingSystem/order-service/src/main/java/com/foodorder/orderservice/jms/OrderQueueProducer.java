package com.foodorder.orderservice.jms;

import com.foodorder.orderservice.dto.OrderMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderQueueProducer {

    private final JmsTemplate jmsTemplate;

    @Value("${app.queue.order}")
    private String orderQueue;

    public void sendOrderToKitchen(OrderMessageDTO message) {
        log.info("Sending order {} to kitchen queue [{}]", message.getOrderId(), orderQueue);
        jmsTemplate.convertAndSend(orderQueue, message);
    }
}
