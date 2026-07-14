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
    options: Array<{
        id: number;
        title: string;
        prediction_id: number;
        is_true: number;
        userPredictionsCount: number;
        myPrediction?: unknown;
    }>;
    comments: Comment[];
    user: { username: string; mobile: string } | null;
    commentsCount: number;
    userPredictionsCount: number;
    predictionForwardCount: number;
    predictionLikes: number;
    isLiked: boolean;
    created_at: string;
    userLike: unknown | null;
    userPrediction: {
        prediction_option_id?: number;
        predictionOptionId?: number;
        created_at?: string;
        createdAt?: string;
        timePast?: string;
    } | null;

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
        this.options = data.predictionOptions ?? [];
        this.comments = [];
        this.user = data.user ?? null;
        this.commentsCount = data.commentsCount ?? 0;
        // The feed includes userPredictionsCount, but the single-prediction
        // response currently returns only each option's server-side count.
        // Use those counts as the total only when the aggregate is absent.
        const optionVoteTotal = this.options.reduce(
            (total, option) => total + (Number(option.userPredictionsCount) || 0),
            0
        );
        this.userPredictionsCount = data.userPredictionsCount ?? optionVoteTotal;
        this.predictionForwardCount = data.predictionForwardCount ?? 0;
        this.predictionLikes = data.predictionLikes ?? 0;
        this.userLike = data.userLike ?? data.user_like ?? null;
        this.created_at = data.created_at ?? null;
        // The feed identifies the current user's like with `userLike` rather
        // than a boolean. Keep supporting the legacy boolean response too.
        this.isLiked = data.isLiked ?? data.is_liked ?? Boolean(this.userLike);
        this.userPrediction = data.userPrediction ?? data.user_prediction ?? null;

     
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
