import { apiClient } from '../lib/axios';
import {
    Prediction,
    PredictionListParams,
    UpdatePredictionData,
    CreatePredictionData,
    PaginatedResponse,
    ApiResponse,
} from '../types/api';

export const predictionService = {
    // Get predictions list with pagination
    async getPredictionFeed(params?: PredictionListParams): Promise<ApiResponse<Prediction[]>> {
        const response = await apiClient.get<ApiResponse<Prediction[]>>(
            '/question-feed',
            { params }
        );
    
        
        return response;
    },

    // Get prediction by ID
    async getPredictionById(id: number | string): Promise<Prediction> {
        const response = await apiClient.get<ApiResponse<Prediction>>(`/questions/${id}`);
        return response.data;
    },

    // Create prediction
    async createPrediction(id: string, userData: CreatePredictionData): Promise<Prediction> {
        const response = await apiClient.post<{ data: Prediction }>(
            `/questions/${id}`,
            userData
        );
        return response.data.data;
    },

    // Update prediction
    async updatePrediction(id: string, userData: UpdatePredictionData): Promise<Prediction> {
        const response = await apiClient.put<{ data: Prediction }>(
            `/questions/${id}`,
            userData
        );
        return response.data.data;
    },
};
