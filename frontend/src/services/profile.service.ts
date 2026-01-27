import api from './api';

export interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    role: string;
    createdAt: string;
}

export const profileService = {
    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        const response = await api.patch('/profile/update', data);
        return response.data.result;
    },

    async getMyProfile(): Promise<UserProfile> {
        const response = await api.get('/profile/my');
        return response.data.result;
    },

    async sendChangePasswordOtp(): Promise<void> {
        await api.post('/profile/send-change-password-otp');
    },

    async verifyChangePasswordOtp(otpCode: string): Promise<string> {
        const response = await api.post('/profile/verify-change-password-otp', { otpCode });
        return response.data.result;
    },

    async changePassword(oldPassword: string, changeToken: string, newPassword: string): Promise<void> {
        await api.post('/profile/change-password', {
            oldPassword,
            changeToken,
            newPassword,
        });
    },

    async uploadAvatar(imageUri: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        } as any);
        const response = await api.post('/profile/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.result;
    },
};
