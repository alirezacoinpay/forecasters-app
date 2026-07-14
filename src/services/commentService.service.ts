import { apiClient } from '../lib/axios';
import {
    Comment as ApiComment,
    AddCommentData,
    LikeCommentApiResponse,
    LikeCommentResponse,
    ApiResponse,
} from '../types/api';
import { Comment } from '../models/Comment';

interface CommentsPaginationMeta {
    current_page: number;
    per_page: number;
    last_page: number;
}

interface CommentsPageResult {
    comments: Comment[];
    meta: CommentsPaginationMeta;
}

function parsePaginatedComments(
    responseData: unknown,
    fallbackPage: number,
    fallbackPerPage: number
): CommentsPageResult {
    let dataArray: unknown[] = [];
    let paginationMeta: CommentsPaginationMeta = {
        current_page: fallbackPage,
        per_page: fallbackPerPage,
        last_page: 1,
    };

    if (Array.isArray(responseData)) {
        dataArray = responseData;
    } else if (responseData && typeof responseData === 'object') {
        const data = responseData as Record<string, unknown>;

        if (Array.isArray(data.data)) {
            dataArray = data.data;
            if (data.meta && typeof data.meta === 'object') {
                const meta = data.meta as Record<string, number>;
                paginationMeta = {
                    current_page: meta.current_page ?? paginationMeta.current_page,
                    per_page: meta.per_page ?? paginationMeta.per_page,
                    last_page: meta.last_page ?? paginationMeta.last_page,
                };
            }
        } else if (data.data && typeof data.data === 'object') {
            const nested = data.data as Record<string, unknown>;
            if (Array.isArray(nested.data)) {
                dataArray = nested.data;
                if (nested.meta && typeof nested.meta === 'object') {
                    const meta = nested.meta as Record<string, number>;
                    paginationMeta = {
                        current_page: meta.current_page ?? paginationMeta.current_page,
                        per_page: meta.per_page ?? paginationMeta.per_page,
                        last_page: meta.last_page ?? paginationMeta.last_page,
                    };
                } else {
                    paginationMeta = {
                        current_page: (nested.current_page as number) ?? paginationMeta.current_page,
                        per_page: (nested.per_page as number) ?? paginationMeta.per_page,
                        last_page: (nested.last_page as number) ?? paginationMeta.last_page,
                    };
                }
            }
        }
    }

    return {
        comments: Comment.fromArray(dataArray),
        meta: paginationMeta,
    };
}

/**
 * Service for managing comment-related API calls
 * 
 * @module commentService
 */
export const commentService = {
    /**
     * Add a new comment or reply to a prediction
     * 
     * @param data - Comment data including prediction_id, text, optional file, and optional parent_id for replies
     * @returns Promise resolving to the created comment
     * @throws {ApiError} If the request fails (network error, validation error, etc.)
     * 
     * @example
     * ```typescript
     * // Add a root comment
     * const comment = await commentService.addComment({
     *   prediction_id: 5,
     *   text: 'This is a comment',
     * });
     * 
     * // Add a reply
     * const reply = await commentService.addComment({
     *   prediction_id: 5,
     *   text: 'This is a reply',
     *   parent_id: 123,
     * });
     * 
     * // Add comment with file
     * const commentWithFile = await commentService.addComment({
     *   prediction_id: 5,
     *   text: 'Comment with image',
     *   file: fileObject,
     * });
     * ```
     */
    async addComment(data: AddCommentData): Promise<ApiComment> {
        const formData = new FormData();
        formData.append('prediction_id', String(data.prediction_id));
        formData.append('text', data.text);
        
        if (data.file) {
            formData.append('file', data.file);
        }
        
        if (data.parent_id !== undefined && data.parent_id !== null) {
            formData.append('parent_id', String(data.parent_id));
        }

        const response = await apiClient.upload<ApiResponse<ApiComment>>(
            '/comments',
            formData
        );
        
        return response.data;
    },

    /**
     * Like or unlike a comment
     * 
     * @param commentId - The ID of the comment to like/unlike
     * @returns Promise resolving to response with like status and updated like count
     * @throws {ApiError} If the request fails (network error, comment not found, etc.)
     * 
     * @example
     * ```typescript
     * const response = await commentService.likeComment(123);
     * console.log(response.liked); // true if liked, false if unliked
     * console.log(response.likesCount); // updated like count
     * ```
     */
    async likeComment(commentId: number | string): Promise<LikeCommentResponse> {
        const response = await apiClient.post<LikeCommentApiResponse>(
            `/comment-likes/${commentId}/toggle`
        );

        // Support the legacy summary, an optional `comment` wrapper, and the
        // current response which returns the updated comment directly.
        const payload = response.data;
        const comment = payload.comment;

        return {
            liked: payload.liked
                ?? payload.is_liked
                ?? payload.isLiked
                ?? Boolean(
                    payload.userLike
                    ?? payload.user_like
                    ?? comment?.userLike
                    ?? comment?.user_like
                ),
            likesCount: payload.likesCount ?? comment?.likesCount ?? 0,
        };
    },

    /**
     * Get comments for a specific prediction
     * 
     * Note: This endpoint is optional if comments are already included in the prediction detail response.
     * 
     * @param predictionId - The ID of the prediction
     * @param params - Optional pagination parameters
     * @returns Promise resolving to list of comments with pagination metadata
     * @throws {ApiError} If the request fails
     * 
     * @example
     * ```typescript
     * // Get first page of comments
     * const response = await commentService.getComments(5);
     * 
     * // Get specific page
     * const page2 = await commentService.getComments(5, { page: 2, per_page: 20 });
     * ```
     */
    async getComments(
        predictionId: number | string,
        params?: { page?: number; per_page?: number }
    ): Promise<CommentsPageResult> {
        const page = params?.page ?? 1;
        const perPage = params?.per_page ?? 15;

        const response = await apiClient.get<ApiResponse<unknown>>(
            `/predictions/${predictionId}/comments`,
            { params: { page, paginate: perPage } }
        );

        return parsePaginatedComments(response.data, page, perPage);
    },
};
