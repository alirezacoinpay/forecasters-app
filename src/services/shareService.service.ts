import { apiClient } from '../lib/axios';
import { ApiResponse } from '../types/api';

interface SendSmsData {
    question_id: number;
    mobile: string;
}

export const shareService = {
    /**
     * Send prediction link via SMS to a mobile number
     * 
     * @param data - Data containing question_id and mobile number
     * @returns Promise resolving to API response
     * @throws {ApiError} If the request fails
     */
    async sendSms(data: SendSmsData): Promise<ApiResponse<any>> {
        // TODO: Update endpoint when API is available
        // For now, using a placeholder endpoint
        const response = await apiClient.post<ApiResponse<any>>(
            '/share/sms',
            {
                question_id: data.question_id,
                mobile: data.mobile,
            }
        );
        
        return response;
    },
};
