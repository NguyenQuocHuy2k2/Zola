import api from './api';

export interface Category {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
}

export interface Size {
    id: number;
    name: string;
}

export interface Color {
    id: number;
    name: string;
    hexCode: string;
}

export const attributeService = {
    // Category Services
    async getCategories(): Promise<Category[]> {
        const response = await api.get('/categories');
        return response.data.result;
    },

    async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
        const response = await api.post('/categories', data);
        return response.data.result;
    },

    async updateCategory(id: number, data: Omit<Category, 'id'>): Promise<Category> {
        const response = await api.put(`/categories/${id}`, data);
        return response.data.result;
    },

    async deleteCategory(id: number): Promise<void> {
        await api.delete(`/categories/${id}`);
    },

    // Size Services
    async getSizes(): Promise<Size[]> {
        const response = await api.get('/attributes/sizes');
        return response.data.result;
    },

    async createSize(data: Omit<Size, 'id'>): Promise<Size> {
        const response = await api.post('/attributes/sizes', data);
        return response.data.result;
    },

    async updateSize(id: number, data: Omit<Size, 'id'>): Promise<Size> {
        const response = await api.put(`/attributes/sizes/${id}`, data);
        return response.data.result;
    },

    async deleteSize(id: number): Promise<void> {
        await api.delete(`/attributes/sizes/${id}`);
    },

    // Color Services
    async getColors(): Promise<Color[]> {
        const response = await api.get('/attributes/colors');
        return response.data.result;
    },

    async createColor(data: Omit<Color, 'id'>): Promise<Color> {
        const response = await api.post('/attributes/colors', data);
        return response.data.result;
    },

    async updateColor(id: number, data: Omit<Color, 'id'>): Promise<Color> {
        const response = await api.put(`/attributes/colors/${id}`, data);
        return response.data.result;
    },

    async deleteColor(id: number): Promise<void> {
        await api.delete(`/attributes/colors/${id}`);
    },
};
