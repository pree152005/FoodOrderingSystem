package com.foodorder.deliveryservice.client;

import com.foodorder.deliveryservice.dto.StatusUpdateDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderServiceClient {

    private final RestTemplate restTemplate;

    @Value("${order.service.base-url}")
    private String orderServiceBaseUrl;

    public void updateOrderStatus(Long orderId, String status) {
        try {
            String url = orderServiceBaseUrl + "/orders/" + orderId + "/status";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<StatusUpdateDTO> entity = new HttpEntity<>(new StatusUpdateDTO(status), headers);

            restTemplate.exchange(url, HttpMethod.PATCH, entity, Void.class);
            log.info("Order {} status updated to {}", orderId, status);
        } catch (RestClientException ex) {
            log.error("Failed to update order {} status to {}: {}", orderId, status, ex.getMessage());
        }
    }
}
