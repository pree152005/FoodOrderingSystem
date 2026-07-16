package com.foodorder.deliveryservice.config;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.connection.CachingConnectionFactory;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;

import jakarta.jms.ConnectionFactory;

@Configuration
public class JmsConfig {

    @Value("${spring.activemq.broker-url}")
    private String brokerUrl;

    @Value("${spring.activemq.user}")
    private String user;

    @Value("${spring.activemq.password}")
    private String password;

    @Bean
    public ConnectionFactory connectionFactory() {
        ActiveMQConnectionFactory activeMQConnectionFactory =
                new ActiveMQConnectionFactory(user, password, brokerUrl);
        return new CachingConnectionFactory(activeMQConnectionFactory);
    }

    @Bean
    public MessageConverter jacksonJmsMessageConverter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTargetType(MessageType.TEXT);
        converter.setTypeIdPropertyName("_type");
        // Map the type sent by order-service/kitchen-service to our local DTO class
        converter.setTypeIdMappings(java.util.Map.of(
            "com.foodorder.orderservice.dto.OrderMessageDTO",
            com.foodorder.deliveryservice.dto.OrderMessageDTO.class,
            "com.foodorder.kitchenservice.dto.OrderMessageDTO",
            com.foodorder.deliveryservice.dto.OrderMessageDTO.class,
            "com.foodorder.deliveryservice.dto.OrderMessageDTO",
            com.foodorder.deliveryservice.dto.OrderMessageDTO.class
        ));
        return converter;
    }

    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter messageConverter) {
        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        factory.setConcurrency("1-3");
        return factory;
    }
}
