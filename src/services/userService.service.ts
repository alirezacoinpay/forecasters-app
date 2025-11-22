import { apiClient } from '../lib/axios';
import {
    User,
    UserListParams,
    UpdateUserData,
    PaginatedResponse,
    ApiResponse,
} from '../types/api';

export const userService = {
    // Get users list with pagination
    async getUsers(params?: UserListParams): Promise<PaginatedResponse<User[]>> {
        const response = await apiClient.get<PaginatedResponse<User[]>>('/users', { params });
        return response.data;
    },

    // Get user by ID
    async getUserById(id: string): Promise<User> {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },

    // Update user
    async updateUser(id: string, userData: UpdateUserData): Promise<User> {
        const response = await apiClient.put<User>(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user
    async deleteUser(id: string): Promise<ApiResponse> {
        const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
        return response.data;
    },

    // Upload avatar
    async uploadAvatar(
        id: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await apiClient.upload<{ avatarUrl: string }>(
            `/users/${id}/avatar`,
            formData,
            onProgress
        );
        return response.data;
    },

    // Change password
    async changePassword(
        id: string,
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse> {
        const response = await apiClient.post<ApiResponse>(`/users/${id}/change-password`, {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};