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

    /**
     * Get current authenticated user profile
     * 
     * @returns Promise resolving to current user data
     * @throws {ApiError} If the request fails (401 if not authenticated, network error, etc.)
     * 
     * @example
     * ```typescript
     * const user = await userService.getCurrentUser();
     * console.log(user.name, user.email);
     * ```
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<ApiResponse<{ user: any }>>('/me');
        const raw = response.data.data.user;
        return {
            ...raw,
            id: raw.id?.toString() ?? raw._id?.toString() ?? '',
            name: raw.name ?? raw.username ?? '',
            avatar: raw.avatar || undefined,
            mobile: raw.mobile ?? undefined,
            email: raw.email ?? undefined,
            userPredictionsCount: raw.userPredictionsCount ?? 0,
        };
    },

    /**
     * Edit current user's profile
     * 
     * Updates the authenticated user's profile information.
     * Only provided fields will be updated.
     * 
     * @param data - Profile data to update (name/username, email, etc.)
     * @returns Promise resolving to updated user data
     * @throws {ApiError} If the request fails (validation error, network error, etc.)
     * 
     * @example
     * ```typescript
     * // Update username only
     * const updatedUser = await userService.editProfile({
     *   name: 'newusername',
     * });
     * 
     * // Update email
     * const user = await userService.editProfile({
     *   email: 'newemail@example.com',
     * });
     * ```
     */
    async editProfile(data: UpdateUserData): Promise<User> {
        const formData = new FormData();
        if (data.name) formData.append('username', data.name);
        if (data.email) formData.append('email', data.email);
        if (data.mobile) formData.append('mobile', data.mobile);

        const response = await apiClient.put<ApiResponse<User>>('/edit-profile', formData);
        return response.data;
    },

    // Update user
    async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
        const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
        return response.data;
    },

    /**
     * Update current user's avatar and username via /user-profile (PUT)
     *
     * Only the avatar and username are sent. Avatar is sent as multipart/form-data.
     */
    async updateProfile(
        data: { username?: string; avatar?: File }
    ): Promise<User> {
        const formData = new FormData();
        if (data.username) formData.append('username', data.username);
        if (data.avatar) formData.append('avatar', data.avatar);
        formData.append('_method', 'put');

        const response = await apiClient.post<ApiResponse<{ user: any }>>('/user-profiles', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const raw = response.data.data?.user ?? response.data.data ?? response.data;
        return {
            ...raw,
            id: raw.id?.toString() ?? raw._id?.toString() ?? '',
            name: raw.name ?? raw.username ?? '',
            avatar: raw.avatar || undefined,
            mobile: raw.mobile ?? undefined,
            email: raw.email ?? undefined,
            userPredictionsCount: raw.userPredictionsCount ?? 0,
        };
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
