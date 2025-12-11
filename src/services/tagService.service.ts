import { apiClient } from '../lib/axios';
import { TagApiResponse, Tag } from '../types/api';

export const tagService = {
    /**
     * Search tags with query parameter
     * 
     * Response structure:
     * {
     *   "success": true,
     *   "data": {
     *     "current_page": 1,
     *     "data": [Tag[]],  // <-- Actual tags array is here
     *     "per_page": 3,
     *     "total": 3,
     *     ...
     *   }
     * }
     * 
     * If the response structure changes, update TagApiResponse interface in types/api.ts
     */
    async searchTags(query?: string, page: number = 1, perPage: number = 3): Promise<Tag[]> {
        const params: Record<string, any> = {
            page,
            paginate: perPage,
        };
        
        if (query) {
            params.search = query;
        }
        
        const response = await apiClient.get<TagApiResponse>('/tags', { params });
        
        // Extract tags from the paginated response structure
        // If response structure changes, update this extraction logic
        if (response.success && response.data && response.data.data) {
            return response.data.data;
        }
        
        return [];
    },
};
