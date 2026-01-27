import api from './api';
import { UserProfile } from './profile.service';

export interface UserCreationRequest {
    username: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
}

export const authService = {
    async register(data: UserCreationRequest): Promise<void> {
        await api.post('/auth/register', data);
    },

    async verifyOTPAndRegister(email: string, otp: string): Promise<AuthResponse> {
        const response = await api.post('/auth/register/verify', {
            email,
            otpCode: otp,
            type: 'REGISTER'
        });
        return response.data.result;
    },

    async login(phone_or_email: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/auth/login', {
            identifier: phone_or_email,
            password: password
        });
        return response.data.result;
    },

    async initForgotPassword(identifier: string): Promise<string> {
        const response = await api.post('/auth/forgot-password/init', { identifier });
        return response.data.result;
    },

    async verifyForgotPasswordOtp(identifier: string, otp: string): Promise<string> {
        const response = await api.post('/auth/forgot-password/verify', { identifier, otpCode: otp });
        return response.data.result.resetToken;
    },

    async resetForgotPassword(identifier: string, resetToken: string, newPassword: string): Promise<void> {
        await api.post('/auth/forgot-password/reset', {
            identifier,
            resetToken,
            newPassword
        });
    },
};
