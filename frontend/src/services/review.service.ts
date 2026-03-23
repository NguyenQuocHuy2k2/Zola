import api from './api';

export interface CreateReviewRequest {
    orderItemId: string;
    rating: number;
    comment?: string;
}

export interface Review {
    id: string;
    orderItemId: string;
    productId: string;
    productName: string;
    imageUrl?: string;
    rating: number;
    comment?: string;
    userFullName?: string;
    userAvatarUrl?: string;
    createdAt: string;
}

export const reviewService = {
    async createReview(data: CreateReviewRequest): Promise<Review> {
        const response = await api.post('/reviews', data);
        return response.data.result;
    },

    async getReviewByOrderItem(orderItemId: string): Promise<Review | null> {
        try {
            const response = await api.get(`/reviews/order-item/${orderItemId}`);
            return response.data.result ?? null;
        } catch {
            return null;
        }
    },

    async getReviewsByProduct(productId: string): Promise<Review[]> {
        try {
            const response = await api.get(`/reviews/product/${productId}`);
            return response.data.result ?? [];
        } catch {
            return [];
        }
    },
};
