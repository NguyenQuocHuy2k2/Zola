package com.zola;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ZolaApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZolaApplication.class, args);
    }
}
