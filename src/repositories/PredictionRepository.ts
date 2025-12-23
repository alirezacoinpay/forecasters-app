import { predictionService } from "../services/predictionService.service";
import { Prediction } from "../models/Prediction";

export class PredictionRepository {
    /**
     * Fetch predictions from the API
     * 
     * @param params - Query parameters including:
     *   - page: Page number
     *   - paginate: Items per page
     *   - search: Search query string
     *   - topic_id: Filter by topic ID
     *   - prediction_id: Deep link support - when provided, the backend should return
     *     predictions with the specified prediction at the top of the list
     * 
     * Backend API requirement:
     * The `/question-feed` endpoint should accept a `prediction_id` parameter.
     * When this parameter is provided, the response should include predictions
     * with the specified prediction at the top of the list, followed by other
     * predictions in the feed.
     */
    async fetch(params: any) {
        const response = await predictionService.getPredictionFeed(params);

        // Type assertion to handle both array and object responses
        // Laravel returns: {success: true, data: {data: [...], links: {...}, meta: {...}}, message: ''}
        const responseData = response.data as any;

      

        // Handle nested data structure: response.data.data contains the array
        let dataArray: any[] = [];
        let paginationMeta = {
            current_page: params?.page || 1,
            per_page: params?.paginate || 20,
            last_page: 1,
        };

        // Type guard: check if response.data is an array
        if (Array.isArray(responseData)) {
            // Direct array response
            dataArray = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
            // Nested structure: response.data is an object with data, links, meta
            dataArray = responseData.data;
            // Extract pagination meta if available
            if (responseData.meta) {
                paginationMeta = {
                    current_page: responseData.meta.current_page || paginationMeta.current_page,
                    per_page: responseData.meta.per_page || paginationMeta.per_page,
                    last_page: responseData.meta.last_page || paginationMeta.last_page,
                };
            }
        }
        
       

        const predictions = Prediction.fromArray(dataArray);

       

        return {
            predictions,
            meta: paginationMeta,
        };
    }
}

export const predictionRepository = new PredictionRepository();
