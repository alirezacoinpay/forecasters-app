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
    async getPredictionFeed(params?: PredictionListParams): Promise<PaginatedResponse<Prediction>> {
        const response = await apiClient.get<PaginatedResponse<Prediction>>(
            '/question-feed',
            { params }
        );
        return response.data;
    },

    // Get prediction by ID
    async getPredictionById(id: string): Promise<Prediction> {
        const response = await apiClient.get<{ data: Prediction }>(`/questions/${id}`);
        return response.data.data;
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
