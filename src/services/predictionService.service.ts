import {apiClient} from '../lib/axios';
import {
    ApiResponse,
    CreatePredictionData,
    LikePredictionApiResponse,
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

    // Get current user's prediction activity (paginated)
    async getUserPredictions(params?: { page?: number; paginate?: number }): Promise<{
        items: Prediction[];
        meta: { current_page: number; per_page: number; last_page: number };
    }> {
        const response = await apiClient.get<any>('/user-predictions', { params });
        const payload = response?.data ?? response;
        const inner = payload?.data ?? payload;
        const rawItems = Array.isArray(inner?.data) ? inner.data : [];
        const meta = inner?.meta ?? inner ?? {};

        // Each record contains a nested `prediction` object. Build a Prediction
        // model and attach the user's chosen option (userPrediction).
        const items = rawItems.map((record: any) => {
            const predictionData = record.prediction ?? record;
            const built = new Prediction({
                ...predictionData,
                userPrediction: {
                    prediction_option_id: record.prediction_option_id,
                    created_at: record.created_at,
                    timePast: record.timePast,
                },
            });
            return built;
        });

        return {
            items,
            meta: {
                current_page: meta.current_page ?? params?.page ?? 1,
                per_page: meta.per_page ?? params?.paginate ?? 10,
                last_page: meta.last_page ?? 1,
            },
        };
    },

    // Get prediction by ID
    async getPredictionById(id: number | string): Promise<Prediction> {
        const response = await apiClient.get<ApiPrediction>(`/predictions/${id}`);
        let payload = response.data as any;

        // ApiClient removes the outer API envelope. This endpoint can still
        // return `{ prediction, userPrediction }` or an extra `{ data: ... }`.
        // Preserve the user prediction while passing the actual prediction
        // object (including predictionOptions and their counts) to the model.
        while (payload?.data && !payload?.id && !payload?.prediction) {
            payload = payload.data;
        }

        const prediction = payload?.prediction && !payload?.id
            ? {
                ...payload.prediction,
                userPrediction: payload.userPrediction
                    ?? payload.user_prediction
                    ?? payload.prediction.userPrediction
                    ?? payload.prediction.user_prediction,
            }
            : payload;

        return new Prediction(prediction);
    },

    // Create prediction
    async createPrediction(data: CreatePredictionData): Promise<ApiResponse<ApiPrediction>> {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.text) {
            formData.append('text', data.text);
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
        const response = await apiClient.post<LikePredictionApiResponse>(
            `/prediction-likes/${predictionId}/toggle`
        );

        // The toggle endpoint returns the updated prediction as
        // `{ prediction: { userLike, predictionLikes } }`, while older API
        // versions returned `{ is_liked, likesCount }`. Normalise both forms
        // so callers can reliably update the heart state and count.
        const payload = response.data;
        const prediction = payload.prediction;

        return {
            ...payload,
            is_liked: payload.is_liked
                ?? payload.isLiked
                ?? Boolean(prediction?.userLike ?? prediction?.user_like),
            likesCount: payload.likesCount
                ?? payload.predictionLikes
                ?? prediction?.predictionLikes
                ?? 0,
        };
    },
};
