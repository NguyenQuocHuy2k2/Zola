import api from './api';
import { Product, PagedResponse } from './product.service';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export const favoriteService = {
    async getReviews(productId: string): Promise<Review[]> {
        await delay(600);
        // Mock reviews
        return [
            {
                id: 'r1', productId, userId: 'u1', userName: 'Người dùng Zola', rating: 5, comment: 'Sản phẩm tuyệt vời, đóng gói cẩn thận!', createdAt: new Date().toISOString()
            },
            {
                id: 'r2', productId, userId: 'u2', userName: 'Khách hàng ẩn danh', rating: 4, comment: 'Giao hàng nhanh, chất lượng ok so với tầm giá.', createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    },

    async addReview(productId: string, rating: number, comment: string): Promise<boolean> {
        await delay(800);
        // Mock logic to add review, award points
        return true;
    },

    async getFavorites(page = 0, size = 10): Promise<PagedResponse<Product>> {
        try {
            const response = await api.get('/favorite-products', { params: { page, size } });
            return response.data.result;
        } catch {
            return {
                content: [],
                totalElements: 0,
                totalPages: 0,
                size: 10,
                number: 0,
                last: true
            };
        }
    },

    async toggleFavorite(product: Product): Promise<boolean> {
        try {
            await api.post(`/favorite-products/${product.id}/toggle`);
            const isFavorite = await this.checkIsFavorite(product.id);
            return isFavorite;
        } catch (e) {
            console.error('Toggle favorite failed', e);
            return false;
        }
    },

    async checkIsFavorite(productId: string): Promise<boolean> {
        try {
            const response = await api.get(`/favorite-products/${productId}/check`);
            return response.data.result;
        } catch {
            return false;
        }
    }
};
