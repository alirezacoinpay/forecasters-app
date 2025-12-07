import { apiClient } from '../lib/axios';
import { ApiResponse, Topic } from '../types/api';

export const topicService = {
    // Get all topics
    async getTopics(): Promise<ApiResponse<Topic[]>> {
        const response = await apiClient.get<ApiResponse<Topic[]>>('/topics');
        return response;
    },
};
