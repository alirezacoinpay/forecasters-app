import { apiClient } from '../lib/axios';
import {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    User,
    ApiResponse
} from '../types/api';

export const authService = {
    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        // Store tokens
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        return response.data;
    },

    // Register
    async register(userData: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            // Always clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
        }
    },

    // Refresh token
    async refreshToken(): Promise<{ token: string; refreshToken: string }> {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
            refreshToken,
        });

        // Update tokens
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        return response.data;
    },

    // Get user profile
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/auth/profile');
        return response.data;
    },

    // Forgot password
    async forgotPassword(email: string): Promise<ApiResponse> {
        const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
        const response = await apiClient.post<ApiResponse>('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    },
};