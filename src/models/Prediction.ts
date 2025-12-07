import { Comment } from './Comment';

export class Prediction {
    id: number;
    title: string;
    text: string;
    categoryId: number;
    topicId: number;
    userId: number | null;
    closesAt: string;
    startsAt: string;
    resolveAt: string | null;
    timePast: string;
    tags: Array<{ id: number; title: string; color: string }>;
    options: Array<{ id: number; title: string; question_id: number; is_true: number; userPredictionsCount: number }>;
    comments: Comment[];
    user: { username: string; mobile: string } | null;
    commentsCount: number;
    userPredictionsCount: number;
    questionForwardCount: number;

    constructor(data: any) {
        // Debug logging
        if (import.meta.env.DEV && !data.id) {
            console.warn('⚠️ Prediction constructor - Missing id:', data);
        }

        this.id = data.id;
        this.title = data.title || '';
        this.text = data.text || '';
        this.categoryId = data.category_id;
        this.topicId = data.topic_id;
        this.userId = data.user_id;
        this.closesAt = data.closes_at;
        this.startsAt = data.starts_at;
        this.resolveAt = data.resolve_at ?? null;
        this.timePast = data.time_past || '';
        this.tags = data.tags ?? [];
        this.options = data.questionOptions ?? [];
        this.comments = (data.comments ?? []).map((c: any) => new Comment(c));
        this.user = data.user ?? null;
        this.commentsCount = data.commentsCount ?? 0;
        this.userPredictionsCount = data.userPredictionsCount ?? 0;
        this.questionForwardCount = data.questionForwardCount ?? 0;

     
    }

    static fromArray(items: any[]): Prediction[] {
        if (!Array.isArray(items)) {
          
            return [];
        }
        
       
        const predictions = items.map((item) => new Prediction(item));
     
        
        return predictions;
    }

    // Calculate percentage for an option
    getOptionPercentage(optionId: number): number {
        if (this.userPredictionsCount === 0) return 0;
        const option = this.options.find(opt => opt.id === optionId);
        if (!option) return 0;
        return Math.round((option.userPredictionsCount / this.userPredictionsCount) * 100);
    }
}
