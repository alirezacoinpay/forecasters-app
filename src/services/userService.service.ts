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
    async getUserById(id: string): Promise<ApiResponse<User>> {
        const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
        return response.data;
    },

    // Update user
    async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
        const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user
    async deleteUser(id: string): Promise<ApiResponse<null>> {
        const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
        return response.data;
    },

    // Upload avatar
    async uploadAvatar(
        id: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<{ avatarUrl: string }>> {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await apiClient.upload<ApiResponse<{ avatarUrl: string }>>(
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
    ): Promise<ApiResponse<null>> {
        const response = await apiClient.post<ApiResponse<null>>(`/users/${id}/change-password`, {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};
