package com.zola.controllers;

import com.zola.dto.request.product.ProductRequest;
import com.zola.dto.request.product.SearchProductRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.product.ProductResponse;
import com.zola.services.product.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

	ProductService productService;

	@PostMapping
	@PreAuthorize("hasAuthority('ADMIN')")
	public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductRequest request) {
		return ApiResponse.<ProductResponse>builder()
				.result(productService.createProduct(request))
				.build();
	}

	@PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasAuthority('ADMIN')")
	public ApiResponse<ProductResponse> uploadImages(
			@PathVariable String id,
			@RequestParam("files") List<MultipartFile> files) throws IOException {
		return ApiResponse.<ProductResponse>builder()
				.result(productService.uploadImages(id, files))
				.build();
	}

	@GetMapping
	public ApiResponse<Page<ProductResponse>> getAllProducts(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) Integer categoryId) {
		Page<ProductResponse> result = categoryId != null
				? productService.getProductsByCategory(categoryId, page, size)
				: productService.getProductsPaged(page, size);
		return ApiResponse.<Page<ProductResponse>>builder()
				.result(result)
				.build();
	}

	@GetMapping("/search")
	public ApiResponse<Page<ProductResponse>> searchProducts(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) Integer categoryId,
			@RequestParam(required = false) java.math.BigDecimal minPrice,
			@RequestParam(required = false) java.math.BigDecimal maxPrice,
			@RequestParam(required = false) Integer colorId,
			@RequestParam(required = false) Integer sizeId,
			@RequestParam(required = false) String status,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {

		SearchProductRequest request = SearchProductRequest.builder()
				.keyword(keyword)
				.categoryId(categoryId)
				.minPrice(minPrice)
				.maxPrice(maxPrice)
				.colorId(colorId)
				.sizeId(sizeId)
				.status(status)
				.page(page)
				.size(size)
				.build();

		return ApiResponse.<Page<ProductResponse>>builder()
				.result(productService.searchProducts(request))
				.build();
	}

	@GetMapping("/{id}")
	public ApiResponse<ProductResponse> getProduct(@PathVariable String id) {
		return ApiResponse.<ProductResponse>builder()
				.result(productService.getProduct(id))
				.build();
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ApiResponse<ProductResponse> updateProduct(@PathVariable String id,
			@RequestBody @Valid ProductRequest request) {
		return ApiResponse.<ProductResponse>builder()
				.result(productService.updateProduct(id, request))
				.build();
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ApiResponse<String> deleteProduct(@PathVariable String id) {
		productService.deleteProduct(id);
		return ApiResponse.<String>builder()
				.result("Product deleted successfully")
				.build();
	}

	@GetMapping("/hot-products")
	public ApiResponse<List<ProductResponse>> getHotProducts() {
		return ApiResponse.<List<ProductResponse>>builder()
				.result(productService.getHotProducts())
				.build();
	}

	@PutMapping("/{id}/toggle-status")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ApiResponse<ProductResponse> toggleProductStatus(@PathVariable String id) {
		return ApiResponse.<ProductResponse>builder()
				.result(productService.toggleProductStatus(id))
				.build();
	}
}
