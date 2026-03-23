package com.zola.converters;

import com.zola.dto.response.category.CategoryResponse;
import com.zola.dto.response.product.ProductImageResponse;
import com.zola.dto.response.product.ProductResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import com.zola.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductConverter {

	private final CategoryConverter categoryConverter;
	private final AttributeConverter attributeConverter;

	public ProductResponse toProductResponse(Product product) {
		if (product == null) {
			return null;
		}

		CategoryResponse categoryResponse = categoryConverter.toCategoryResponse(product.getCategory());

		List<ProductImageResponse> imageResponses = product.getImages() != null ? product.getImages().stream()
				.map(img -> ProductImageResponse.builder()
						.id(img.getId())
						.imageUrl(img.getImageUrl())
						.isPrimary(img.getIsPrimary())
						.build())
				.collect(Collectors.toList()) : null;

		List<ProductVariantResponse> variantResponses = product.getVariants() != null
				? product.getVariants().stream()
						.filter(v -> v.getDeletedAt() == null)
						.map(v -> ProductVariantResponse.builder()
								.id(v.getId())
								.size(attributeConverter.toSizeResponse(v.getSize()))
								.color(attributeConverter.toColorResponse(v.getColor()))
								.stockQuantity(v.getStockQuantity())
								.build())
						.collect(Collectors.toList())
				: null;

		return ProductResponse.builder()
				.id(product.getId())
				.name(product.getName())
				.description(product.getDescription())
				.basePrice(product.getBasePrice())
				.status(product.getStatus().name())
				.brand(product.getBrand())
				.category(categoryResponse)
				.images(imageResponses)
				.variants(variantResponses)
				.favoriteCount(product.getFavoriteCount())
				.build();
	}
}
