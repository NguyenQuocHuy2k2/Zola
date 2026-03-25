import api from './api';

export interface DashboardStats {
    monthlyRevenue: number;
    monthlyOrders: number;
    totalProducts: number;
    totalUsers: number;
}

export interface DailyOrderStat {
    date: string;
    count: number;
}

export interface LowStockProduct {
    productId: string;
    productName: string;
    productVariantId: string;
    size: string | null;
    color: string | null;
    stockQuantity: number;
    imageUrl?: string;
    price: number;
    categoryName?: string;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats | null> {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return response.data.result;
        } catch (error) {
            console.error('Fetch dashboard stats failed', error);
            return null;
        }
    },

    async getDailyOrders(startDate: string, endDate: string): Promise<DailyOrderStat[]> {
        try {
            const response = await api.get(`/admin/dashboard/daily-orders?startDate=${startDate}&endDate=${endDate}`);
            return response.data.result || [];
        } catch (error) {
            console.error('Fetch daily orders failed', error);
            return [];
        }
    },

    async getLowStockProducts(): Promise<LowStockProduct[]> {
        try {
            const response = await api.get('/admin/dashboard/low-stock');
            return response.data.result || [];
        } catch (error) {
            console.error('Fetch low stock products failed', error);
            return [];
        }
    }
};
