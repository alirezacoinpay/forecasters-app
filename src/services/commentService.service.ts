import { apiClient } from '../lib/axios';
import {
    Comment,
    AddCommentData,
    LikeCommentResponse,
    ApiResponse,
} from '../types/api';

/**
 * Service for managing comment-related API calls
 * 
 * @module commentService
 */
export const commentService = {
    /**
     * Add a new comment or reply to a prediction
     * 
     * @param data - Comment data including question_id, text, optional file, and optional parent_id for replies
     * @returns Promise resolving to the created comment
     * @throws {ApiError} If the request fails (network error, validation error, etc.)
     * 
     * @example
     * ```typescript
     * // Add a root comment
     * const comment = await commentService.addComment({
     *   question_id: 5,
     *   text: 'This is a comment',
     * });
     * 
     * // Add a reply
     * const reply = await commentService.addComment({
     *   question_id: 5,
     *   text: 'This is a reply',
     *   parent_id: 123,
     * });
     * 
     * // Add comment with file
     * const commentWithFile = await commentService.addComment({
     *   question_id: 5,
     *   text: 'Comment with image',
     *   file: fileObject,
     * });
     * ```
     */
    async addComment(data: AddCommentData): Promise<Comment> {
        const formData = new FormData();
        formData.append('question_id', String(data.question_id));
        formData.append('text', data.text);
        
        if (data.file) {
            formData.append('file', data.file);
        }
        
        if (data.parent_id !== undefined && data.parent_id !== null) {
            formData.append('parent_id', String(data.parent_id));
        }

        const response = await apiClient.upload<ApiResponse<Comment>>(
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
        const response = await apiClient.post<ApiResponse<LikeCommentResponse>>(
            `/comments/${commentId}/like`
        );
        
        return response.data;
    },

    /**
     * Get comments for a specific question
     * 
     * Note: This endpoint is optional if comments are already included in the question detail response.
     * 
     * @param questionId - The ID of the question
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
        questionId: number | string,
        params?: { page?: number; per_page?: number }
    ): Promise<ApiResponse<Comment[]>> {
        const response = await apiClient.get<ApiResponse<Comment[]>>(
            `/questions/${questionId}/comments`,
            { params }
        );
        
        return response;
    },
};
