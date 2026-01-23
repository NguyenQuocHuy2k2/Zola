package com.zola.services.email;

import com.zola.dto.request.email.EmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "email-client", url = "${email.host}")
public interface EmailClient {
    @PostMapping(value = "${email.endpoint}", consumes = "application/json")
    String sendEmail(
            @RequestHeader("api-key") String apiKey,
            @RequestBody EmailRequest emailRequest);
}
