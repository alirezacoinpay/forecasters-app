export class Comment {
    id?: number;
    file: string | null;
    parent_id: number | null;
    prediction_id: number;
    text: string;
    time_past: string;
    user_id: number;
    user: { username: string; mobile: string } | null;
    childrenCount: number;
    likesCount: number;
    children?: Comment[];

    constructor(data: any) {
        // Use provided id, or keep undefined (will be handled by component with index)
        this.id = data.id;
        this.file = data.file ?? null;
        this.parent_id = data.parent_id ?? null;
        this.prediction_id = data.prediction_id ?? data.question_id;
        this.text = data.text;
        this.time_past = data.time_past;
        this.user_id = data.user_id;
        this.user = data.user ?? null;
        this.children = (data.children ?? []).map((c: any) => new Comment(c));
        this.childrenCount = data.childrenCount ?? 0;
        this.likesCount = data.likesCount ?? 0;
    }

    static fromArray(items: any[]): Comment[] {
        if (!Array.isArray(items)) return [];
        return items.map((item) => new Comment(item));
    }

    // Check if comment is a root comment (no parent)
    isRoot(): boolean {
        return this.parent_id === null;
    }
}
