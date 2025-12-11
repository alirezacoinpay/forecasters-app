import { apiClient } from '../lib/axios';
import {
    Prediction,
    PredictionListParams,
    UpdatePredictionData,
    CreatePredictionData,
    CreateQuestionData,
    PaginatedResponse,
    ApiResponse,
    SubmitPredictionData,
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

    // Create question/prediction
    async createQuestion(data: CreateQuestionData): Promise<ApiResponse<Prediction>> {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.text) {
            formData.append('text', data.text);
        }
        formData.append('topic_id', String(data.topic_id));
        if (data.category_id) {
            formData.append('category_id', String(data.category_id));
        }
        if (data.starts_at) {
            formData.append('starts_at', data.starts_at);
        }
        
        // Add options
        data.options.forEach((option, index) => {
            formData.append(`options[${index}]`, option);
        });
        
        // Add tags
        if (data.tags && data.tags.length > 0) {
            data.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });
        }

        const response = await apiClient.upload<ApiResponse<Prediction>>(
            '/questions',
            formData
        );
        
        return response;
    },

    // Update prediction
    async updatePrediction(id: string, userData: UpdatePredictionData): Promise<Prediction> {
        const response = await apiClient.put<{ data: Prediction }>(
            `/questions/${id}`,
            userData
        );
        return response.data.data;
    },

    /**
     * Submit a prediction (select an option for a question)
     * 
     * This method sends a FormData request with the selected option and optional comment.
     * The comment can include text and/or a file attachment.
     * 
     * @param data - Prediction data including question_option_id and optional comment with text/file
     * @returns Promise resolving to API response containing the created prediction
     * @throws {ApiError} If the request fails (validation error, network error, etc.)
     * 
     * @example
     * ```typescript
     * // Submit prediction without comment
     * const prediction = await predictionService.submitPrediction({
     *   question_option_id: 7,
     * });
     * 
     * // Submit prediction with text comment
     * const predictionWithComment = await predictionService.submitPrediction({
     *   question_option_id: 7,
     *   comment: {
     *     text: 'I think this will happen because...',
     *   },
     * });
     * 
     * // Submit prediction with file
     * const predictionWithFile = await predictionService.submitPrediction({
     *   question_option_id: 7,
     *   comment: {
     *     text: 'See attached image',
     *     file: fileObject,
     *   },
     * });
     * ```
     */
    async submitPrediction(data: SubmitPredictionData): Promise<ApiResponse<Prediction>> {
        const formData = new FormData();
        formData.append('question_option_id', String(data.question_option_id));
        
        if (data.comment) {
            if (data.comment.text) {
                formData.append('comment[text]', data.comment.text);
            }
            if (data.comment.file) {
                formData.append('comment[file]', data.comment.file);
            }
        }

        const response = await apiClient.upload<ApiResponse<Prediction>>(
            '/predictions',
            formData
        );
        
        return response;
    },
};
