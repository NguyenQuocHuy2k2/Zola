import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Queue để tránh race condition khi nhiều request cùng nhận 401 và refresh token đồng thời
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Đợi request đang refresh xong rồi retry với token mới
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken: refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.result;

                await SecureStore.setItemAsync('userToken', accessToken);
                await SecureStore.setItemAsync('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                onTokenRefreshed(accessToken);
                return api(originalRequest);
            } catch (err) {
                // Refresh failed - logout user
                refreshSubscribers = [];
                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('refreshToken');
                await SecureStore.deleteItemAsync('user');
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
