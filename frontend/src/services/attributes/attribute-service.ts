import api from '../api';

export interface Category {
    id: number;
    name: string;
    description: string;
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

// Category Services
export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.result;
};

export const createCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post('/admin/categories', data);
    return response.data.result;
};

export const updateCategory = async (id: number, data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data.result;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
};

// Size Services
export const getSizes = async (): Promise<Size[]> => {
    const response = await api.get('/attributes/sizes');
    return response.data.result;
};

export const createSize = async (data: Omit<Size, 'id'>): Promise<Size> => {
    const response = await api.post('/admin/attributes/sizes', data);
    return response.data.result;
};

export const updateSize = async (id: number, data: Omit<Size, 'id'>): Promise<Size> => {
    const response = await api.put(`/admin/attributes/sizes/${id}`, data);
    return response.data.result;
};

export const deleteSize = async (id: number): Promise<void> => {
    await api.delete(`/admin/attributes/sizes/${id}`);
};

// Color Services
export const getColors = async (): Promise<Color[]> => {
    const response = await api.get('/attributes/colors');
    return response.data.result;
};

export const createColor = async (data: Omit<Color, 'id'>): Promise<Color> => {
    const response = await api.post('/admin/attributes/colors', data);
    return response.data.result;
};

export const updateColor = async (id: number, data: Omit<Color, 'id'>): Promise<Color> => {
    const response = await api.put(`/admin/attributes/colors/${id}`, data);
    return response.data.result;
};

export const deleteColor = async (id: number): Promise<void> => {
    await api.delete(`/admin/attributes/colors/${id}`);
};
