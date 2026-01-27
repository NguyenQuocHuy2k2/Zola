import api from './api';

export interface Address {
    id: string;
    province: string;
    district: string;
    ward: string;
    streetAddress?: string;
    isDefault: boolean;
    createdAt: string;
}

export interface AddressRequest {
    province: string;
    district: string;
    ward: string;
    streetAddress?: string;
    isDefault?: boolean;
}

export const addressService = {
    async getMyAddresses(): Promise<Address[]> {
        const response = await api.get('/addresses');
        return response.data.result;
    },

    async addAddress(request: AddressRequest): Promise<Address> {
        const response = await api.post('/addresses', request);
        return response.data.result;
    },

    async updateAddress(id: string, request: AddressRequest): Promise<Address> {
        const response = await api.put(`/addresses/${id}`, request);
        return response.data.result;
    },

    async deleteAddress(id: string): Promise<void> {
        await api.delete(`/addresses/${id}`);
    },

    async setDefault(id: string): Promise<Address> {
        const response = await api.patch(`/addresses/${id}/set-default`);
        return response.data.result;
    },
};
