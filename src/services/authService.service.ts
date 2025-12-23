import { apiClient } from '../lib/axios';
import {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    User,
    ApiResponse
} from '../types/api';
import { userService } from './userService.service';

export const authService = {
    // Check if user is authenticated by calling /me endpoint
    async checkAuth(): Promise<User | null> {
        try {
            const user = await userService.getCurrentUser();
            return user;
        } catch (error: any) {
            // 401 or 403 means no valid session
            if (error?.status === 401 || error?.status === 403) {
                return null;
            }
            throw error;
        }
    },

    // Automatic login - calls /login with no body to get a cookie
    async autoLogin(): Promise<User> {
        // Call /login with empty body - backend will create user and set cookie
        const response = await apiClient.post<AuthResponse>('/login', {});
        
        // After login, get the user from /me
        const user = await userService.getCurrentUser();
        return user;
    },

    // Login (if still needed for explicit login with credentials)
    async login(credentials?: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/login', credentials || {});
        // Cookie is set automatically by backend, no need to store tokens
        return response.data;
    },

    // Register (if still needed for explicit registration)
    async register(userData: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', userData);
        // Cookie is set automatically by backend, no need to store tokens
        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            // Clear session storage
            // Cookie will be cleared by backend
        }
    },

    // Get user profile
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/auth/profile');
        return response.data;
    },



    // Forgot password
    async deleteUser(email: string): Promise<ApiResponse<null>> {
        const response = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
        const response = await apiClient.post<ApiResponse<null>>('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    },

    // Send email verification code
    async sendEmailVerificationCode(email: string): Promise<void> {
        await apiClient.post<ApiResponse<null>>('/auth/send-email-verification', {
            email,
        });
    },

    // Verify email
    async verifyEmail(email: string, verificationCode: string): Promise<User> {
        const response = await apiClient.put<User>('/auth/verify-email', {
            email,
            verification_code: verificationCode,
        });
        return response.data;
    },

    // Send mobile verification code
    async sendMobileVerificationCode(mobile: string): Promise<void> {
        await apiClient.post<ApiResponse<null>>('/auth/send-mobile-verification', {
            mobile,
        });
    },

    // Verify mobile
    async verifyMobile(mobile: string, verificationCode: string): Promise<User> {
        const response = await apiClient.put<User>('/auth/verify-mobile', {
            mobile,
            verification_code: verificationCode,
        });
        return response.data;
    },
};