package com.zola.dto.request.email;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Builder
@Getter
public class EmailRequest {
    Account sender;
    List<Account> to;
    String subject;
    String htmlContent;
}
