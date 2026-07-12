import {apiClient} from '../lib/axios';
import {
    ApiResponse,
    CreatePredictionData,
    LikePredictionResponse,
    Prediction as ApiPrediction,
    PredictionListParams,
    SubmitPredictionData,
    UpdatePredictionData,
} from '../types/api';
import { Prediction } from '../models/Prediction';

export const predictionService = {
    // Get predictions list with pagination
    async getPredictionFeed(params?: PredictionListParams): Promise<ApiResponse<ApiPrediction[]>> {
        return await apiClient.get<ApiResponse<ApiPrediction[]>>(
            '/prediction-feed',
            {params}
        );
    },

    // Get prediction by ID
    async getPredictionById(id: number | string): Promise<Prediction> {
        const response = await apiClient.get<ApiResponse<ApiPrediction>>(`/predictions/${id}`);
        return new Prediction(response.data);
    },

    // Create prediction
    async createPrediction(data: CreatePredictionData): Promise<ApiResponse<ApiPrediction>> {
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

        return await apiClient.upload<ApiResponse<ApiPrediction>>(
            '/predictions',
            formData
        );
    },

    // Update prediction
    async updatePrediction(id: string, userData: UpdatePredictionData): Promise<ApiPrediction> {
        const response = await apiClient.put<{ data: ApiPrediction }>(
            `/predictions/${id}`,
            userData
        );
        return response.data.data;
    },

    /**
     * Submit a prediction (select an option for a prediction)
     *
     * This method sends a FormData request with the selected option and optional comment.
     * The comment can include text and/or a file attachment.
     *
     * @param data - Prediction data including prediction_option_id and optional comment with text/file
     * @returns Promise resolving to API response containing the created prediction
     * @throws {ApiError} If the request fails (validation error, network error, etc.)
     *
     * @example
     * ```typescript
     * // Submit prediction without comment
     * const prediction = await predictionService.submitPrediction({
     *   prediction_option_id: 7,
     * });
     *
     * // Submit prediction with text comment
     * const predictionWithComment = await predictionService.submitPrediction({
     *   prediction_option_id: 7,
     *   comment: {
     *     text: 'I think this will happen because...',
     *   },
     * });
     *
     * // Submit prediction with file
     * const predictionWithFile = await predictionService.submitPrediction({
     *   prediction_option_id: 7,
     *   comment: {
     *     text: 'See attached image',
     *     file: fileObject,
     *   },
     * });
     * ```
     */
    async submitPrediction(data: SubmitPredictionData): Promise<ApiResponse<ApiPrediction>> {
        const formData = new FormData();
        formData.append('prediction_option_id', String(data.prediction_option_id));

        if (data.comment) {
            if (data.comment.text) {
                formData.append('comment[text]', data.comment.text);
            }
            if (data.comment.file) {
                formData.append('comment[file]', data.comment.file);
            }
        }

        return await apiClient.upload<ApiResponse<ApiPrediction>>(
            '/user-predictions',
            formData
        );
    },

    /**
     * Like or unlike a prediction
     *
     * This method toggles the like status of a prediction. If the prediction is currently
     * unliked, it will be liked. If it's currently liked, it will be unliked.
     *
     * Backend endpoint: POST `/prediction-likes/:id/toggle`
     *
     * @param predictionId - The ID of the prediction to like/unlike
     * @returns Promise resolving to response with like status and updated like count
     * @throws {ApiError} If the request fails (network error, prediction not found, etc.)
     *
     * @example
     * ```typescript
     * const response = await predictionService.likePrediction(123);
     * console.log(response.liked); // true if liked, false if unliked
     * console.log(response.likesCount); // updated like count
     * ```
     */
    async likePrediction(predictionId: number | string): Promise<LikePredictionResponse> {
        const response = await apiClient.post<ApiResponse<LikePredictionResponse>>(
            `/prediction-likes/${predictionId}/toggle`
        );
        
        return response.data;
    },
};
