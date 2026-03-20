import api from './api';
import { Color, Size, Category } from './attribute.service';
export { Color, Size, Category };

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface SearchHistory {
  id: number;
  keyword: string;
  createdAt: string;
}

export interface SearchFilters {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  colorId?: number;
  sizeId?: number;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductVariant {
  id: number;
  size?: { id: number; name: string };
  color?: { id: number; name: string; hexCode: string };
  stockQuantity: number;
}

export interface CreateProductVariantDto {
  sizeId: number;
  colorId: number;
  stockQuantity: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  basePrice: number;
  status: string;
  brand: string;
  categoryId: number;
  variants: CreateProductVariantDto[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  status: string;
  brand: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  favoriteCount?: number;
  createdAt?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export const getProductPrimaryImage = (product: Product): string | undefined =>
  product.images?.find((img) => img.isPrimary)?.imageUrl ??
  product.images?.[0]?.imageUrl;

export const productService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.result;
  },

  async getProducts(page = 0, size = 10): Promise<PagedResponse<Product>> {
    const response = await api.get('/products', { params: { page, size } });
    return response.data.result;
  },

  async getProductsByCategory(
    categoryId: number,
    page = 0,
    size = 10
  ): Promise<PagedResponse<Product>> {
    const response = await api.get('/products', {
      params: { page, size, categoryId },
    });
    return response.data.result;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.result;
  },

  async searchProducts(filters: SearchFilters): Promise<PagedResponse<Product>> {
    const response = await api.get('/products/search', { params: filters });
    return response.data.result;
  },

  async getSearchHistory(limit = 10): Promise<SearchHistory[]> {
    const response = await api.get('/search-history', { params: { limit } });
    return response.data.result;
  },

  async deleteSearchHistory(id: number): Promise<void> {
    await api.delete(`/search-history/${id}`);
  },

  async clearSearchHistory(): Promise<void> {
    await api.delete('/search-history');
  },

  async getColors(): Promise<Color[]> {
    const response = await api.get('/attributes/colors');
    return response.data.result;
  },

  async getSizes(): Promise<Size[]> {
    const response = await api.get('/attributes/sizes');
    return response.data.result;
  },

  async getHotProducts(): Promise<Product[]> {
    const response = await api.get('/products/hot-products');
    return response.data.result;
  },

  // Admin: Create product (Two-step process: JSON then Image Upload)
  async createProduct(
    productData: CreateProductDto,
    images: any[]
  ): Promise<Product> {
    // 1. Create product (JSON)
    const response = await api.post('/products', productData);
    const createdProduct = response.data.result;

    // 2. Upload images if any
    if (images && images.length > 0) {
      try {
        await this.uploadProductImages(createdProduct.id, images);
        // Return updated product with images
        return await this.getProductById(createdProduct.id);
      } catch (error) {
        console.error('Failed to upload images after product creation', error);
        // Still return the created product even if image upload fails
        return createdProduct;
      }
    }

    return createdProduct;
  },

  // Admin: Update basic product info
  async updateProduct(id: string | number, productData: any): Promise<Product> {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.result;
  },

  // Admin: Update stock
  async updateProductStock(
    id: string | number,
    stockQuantity: number
  ): Promise<ProductVariant> {
    const response = await api.put(`/products/variants/${id}/stock`, null, {
      params: { stockQuantity },
    });
    return response.data.result;
  },

  // Admin: Upload additional images
  async uploadProductImages(
    productId: string | number,
    images: any[]
  ): Promise<ProductImage[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('files', {
        uri: image.uri,
        type: image.mimeType || 'image/jpeg',
        name: image.fileName || `additional_image_${Date.now()}.jpg`,
      } as any);
    });

    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.result;
  },

  // Admin: Delete product
  async deleteProduct(id: string | number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Admin: Toggle product status (active/inactive)
  async toggleProductStatus(id: string | number): Promise<Product> {
    const response = await api.put(`/products/${id}/toggle-status`);
    return response.data.result;
  },
};