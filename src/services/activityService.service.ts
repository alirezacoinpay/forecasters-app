import { apiClient } from '../lib/axios';
import {
    ActivityLogData,
    ApiResponse,
} from '../types/api';

/**
 * Service for logging user activities to the backend
 * 
 * Activities are logged with device-type and X-Platform headers as per API specification.
 * This service uses fire-and-forget approach - failures are silently ignored to not block user actions.
 * 
 * @module activityService
 */
export const activityService = {
    /**
     * Log a user activity to the backend
     * 
     * This method automatically includes device-type (desktop/mobile) and X-Platform (web/android/ios) headers.
     * Failures are silently ignored to prevent blocking user actions.
     * 
     * @param action - The action name (e.g., 'feed_view', 'prediction_submit', 'comment_like')
     * @param meta - Optional metadata about the activity (e.g., { page: 'home', question_id: 5 })
     * @returns Promise that resolves when logging is complete (or fails silently)
     * 
     * @example
     * ```typescript
     * // Log feed view
     * await activityService.logActivity('feed_view', { page: 'home', topic_id: 1 });
     * 
     * // Log prediction submission
     * await activityService.logActivity('prediction_submit', {
     *   question_id: 5,
     *   question_option_id: 7,
     * });
     * 
     * // Log comment like
     * await activityService.logActivity('comment_like', {
     *   comment_id: 123,
     *   liked: true,
     * });
     * ```
     */
    async logActivity(action: string, meta?: Record<string, any>): Promise<void> {
        try {
            const data: ActivityLogData = {
                action,
                meta,
            };

            // Determine device type and platform
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );
            const deviceType = isMobile ? 'mobile' : 'desktop';
            const platform = 'web'; // Since this is a web app

            await apiClient.post<ApiResponse<null>>('/activity', data, {
                headers: {
                    'device-type': deviceType,
                    'X-Platform': platform,
                },
            });
        } catch (error) {
            // Silently fail - activity logging should not block user actions
            if (import.meta.env.DEV) {
                console.warn('Failed to log activity:', error);
            }
        }
    },
};
