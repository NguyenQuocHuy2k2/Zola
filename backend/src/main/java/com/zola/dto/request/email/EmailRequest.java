package com.zola.dto.request.email;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class EmailRequest {
    private Account sender;
    private List<Account> to;
    private String subject;
    private String htmlContent;
}
