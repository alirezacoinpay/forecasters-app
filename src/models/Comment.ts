export class Comment {
    id: number;
    file: string;
    parent_id: number;
    parent: any;
    question_id: number;
    question: any;
    text: string;
    time_past: string;
    user_id: number;
    user: any;
    childrenCount: number;
    likesCount: number;
    children: any;

    constructor(data: any) {
        this.id = data.id;
        this.file = data.title;
        this.parent_id = data.parent_id;
        this.parent = data.parent ?? null;
        this.question_id = data.question_id;
        this.question = data.question ?? null;
        this.text = data.text;
        this.time_past = data.time_past;
        this.user_id = data.user_id;
        this.user = data.user ?? null;
        this.children = data.children ?? [];
        this.childrenCount = data.childrenCount ?? 0;
        this.likesCount = data.likesCount ?? 0;
    }

    static fromArray(items: any[]): Comment[] {
        if (!Array.isArray(items)) return [];
        return items.map((item) => new Comment(item));
    }
}
