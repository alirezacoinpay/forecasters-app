import { apiClient } from '../lib/axios';
import { SearchHistoryItem, ApiResponse } from '../types/api';

/**
 * Search Service
 * 
 * Handles search history management and search-related API calls.
 * 
 * Required Backend API Endpoints:
 * - GET /search-history - Returns user's recent search history
 *   Response: SearchHistoryResponse
 * 
 * - DELETE /search-history/:id - Deletes a specific search history item
 *   Response: ApiResponse<{ success: boolean }>
 */
export const searchService = {
    /**
     * Get user's recent search history
     * 
     * @returns Promise resolving to array of search history items
     */
    async getSearchHistory(): Promise<SearchHistoryItem[]> {
        try {
            const response = await apiClient.get<ApiResponse<SearchHistoryItem[]>>('/search-history');
            
            // apiClient.get returns ApiResponse<T>, so response.data is SearchHistoryItem[]
            if (response.success && response.data) {
                if (Array.isArray(response.data)) {
                    return response.data;
                }
                // Handle nested structure if API returns {data: {data: [...]}}
                if (response.data && typeof response.data === 'object' && 'data' in response.data) {
                    const nestedData = (response.data as any).data;
                    if (Array.isArray(nestedData)) {
                        return nestedData;
                    }
                }
            }
            return [];
        } catch (error) {
            console.error('Error fetching search history:', error);
            // Return empty array on error to gracefully handle missing endpoint
            return [];
        }
    },

    /**
     * Delete a search history item
     * 
     * @param id - The ID of the search history item to delete
     * @returns Promise resolving to success status
     */
    async deleteSearchHistoryItem(id: number): Promise<boolean> {
        try {
            const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/search-history/${id}`);
            return response.success;
        } catch (error) {
            console.error('Error deleting search history item:', error);
            return false;
        }
    },
};
