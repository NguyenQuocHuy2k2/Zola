import api from './api';

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
    page?: number;
    size?: number;
}

export interface Color {
    id: number;
    name: string;
    hexCode: string;
}

export interface Size {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
}



export interface ProductVariant {
    id: number;
    size?: { id: number; name: string };
    color?: { id: number; name: string; hexCode: string };
    stockQuantity: number;
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
    product.images?.find(img => img.isPrimary)?.imageUrl ?? product.images?.[0]?.imageUrl;

export const productService = {
    async getCategories(): Promise<Category[]> {
        const response = await api.get('/categories');
        return response.data.result;
    },

    async getProducts(page = 0, size = 10): Promise<PagedResponse<Product>> {
        const response = await api.get('/products', { params: { page, size } });
        return response.data.result;
    },

    async getProductsByCategory(categoryId: number, page = 0, size = 10): Promise<PagedResponse<Product>> {
        const response = await api.get('/products', { params: { page, size, categoryId } });
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
};
