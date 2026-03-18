import api from './api';

export interface DashboardStats {
    monthlyRevenue: number;
    monthlyOrders: number;
    totalProducts: number;
    totalUsers: number;
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
    }
};
