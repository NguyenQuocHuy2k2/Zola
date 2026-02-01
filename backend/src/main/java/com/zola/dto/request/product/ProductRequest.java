package com.zola.dto.request.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    String name;

    String description;

    @NotNull(message = "Base price is required")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    BigDecimal basePrice;

    String status;

    @NotNull(message = "Category ID is required")
    Long categoryId;

    List<ProductVariantRequest> variants;
}
