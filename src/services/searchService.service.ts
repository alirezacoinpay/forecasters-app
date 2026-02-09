import { apiClient } from '../lib/axios';
import { SearchHistoryResponse, SearchHistoryItem, ApiResponse } from '../types/api';

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
            const response = await apiClient.get<SearchHistoryResponse>('/search-history');
            if (response.success && response.data) {
                return response.data.data;
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
