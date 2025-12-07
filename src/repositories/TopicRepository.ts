import { topicService } from '../services/topicService.service';
import { Topic } from '../types/api';

export class TopicRepository {
    async fetch(): Promise<Topic[]> {
        const response = await topicService.getTopics();
        const responseData = response.data as any;

        // Handle nested data structure if needed
        let dataArray: any[];
        if (Array.isArray(responseData)) {
            dataArray = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
            dataArray = responseData.data;
        } else {
            dataArray = [];
        }

        return dataArray.map((item) => ({
            id: item.id,
            title: item.title,
            category_id: item.category_id,
        }));
    }
}

export const topicRepository = new TopicRepository();
