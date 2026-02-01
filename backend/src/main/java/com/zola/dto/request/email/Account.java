package com.zola.dto.request.email;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Builder
@Getter
public class Account {
    String name;
    String email;
}
