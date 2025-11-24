export class Prediction {
    id: number;
    title: string;
    text: string;
    categoryId: number;
    topicId: number;
    closesAt: string;
    startsAt: string;
    timePast: string;
    tags: any[];
    options: any[];
    user: any;
    commentsCount: number;
    userPredictionsCount: number;
    questionForwardCount: number;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.text = data.text;
        this.categoryId = data.category_id;
        this.topicId = data.topic_id;
        this.closesAt = data.closes_at;
        this.startsAt = data.starts_at;
        this.timePast = data.time_past;
        this.tags = data.tags ?? [];
        this.options = data.questionOptions ?? [];
        this.user = data.user ?? null;
        this.commentsCount = data.commentsCount ?? 0;
        this.userPredictionsCount = data.userPredictionsCount ?? 0;
        this.questionForwardCount = data.questionForwardCount ?? 0;
    }

    static fromArray(items: any[]): Prediction[] {
        if (!Array.isArray(items)) return [];
        return items.map((item) => new Prediction(item));
    }
}
