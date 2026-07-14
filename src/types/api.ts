// انواع پایه برای API
// =========================
// BASE API RESPONSE
// =========================
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// =========================
// LIST RESPONSE (non paginated)
// =========================
export type ListResponse<T> = ApiResponse<T[]>;

// =========================
// PAGINATED RESPONSE
// =========================
export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    path: string;
    links: Array<{
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }>
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        per_page: number;
        last_page: number;
    };
    links: any;
}

// Tag API Response Structure
// The tags endpoint returns a paginated response with this structure:
// {
//   "success": true,
//   "data": {
//     "current_page": 1,
//     "data": [Tag[]],
//     "first_page_url": "...",
//     "from": 1,
//     "last_page": 1,
//     "last_page_url": "...",
//     "links": [...],
//     "next_page_url": null,
//     "path": "...",
//     "per_page": 3,
//     "prev_page_url": null,
//     "to": 3,
//     "total": 3
//   }
// }
export interface TagApiResponse {
    success: boolean;
    data: {
        current_page: number;
        data: Tag[];
        first_page_url: string | null;
        from: number;
        last_page: number;
        last_page_url: string | null;
        links: Array<{
            url: string | null;
            label: string;
            page: number | null;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    message?: string;
}

// =========================
// API ERROR
// =========================
export interface ApiError<T = any> {
    message: string;
    status: number;
    data?: T;
}

export interface RequestConfig {
    timeout?: number;
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
}

export interface UserPrediction {
    id: number;
    percentage: string;
    user_id: number;
    prediction_option_id: number;
    /** Camel-case form returned by some prediction endpoints. */
    predictionOptionId?: number;
    created_at: string;
    updated_at: string;
    likesCount? : number;
    isLiked? : boolean;
    timePast : string;
    prediction: Prediction;
    predictionOption: PredictionOption;
}

export interface User {
    id: string;
    name: string;
    email: string;
    mobile?: string;
    avatar?: string;
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt: string;
    session_id?: string;
    device_fingerprint?: string;
    is_verified?: boolean;
    email_verified_at?: string;
    mobile_verified_at?: string;
    userPredictions?: UserPrediction[];
    userPredictionsCount?: number;
}

export interface UserListParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    mobile?: string;
    role?: string;
}

export interface Prediction {
  id: number;
  title: string;
  text: string;
  category_id: number;
  topic_id: number;
  user_id: number | null;
  closes_at: string;
  starts_at: string;
  resolve_at: string | null;
  time_past: string;
  userPredictionsCount: number;
  commentsCount: number;
  predictionForwardCount: number;
  user: {
    username: string;
    mobile: string;
  } | null;
  tags: Tag[];
  predictionOptions: PredictionOption[];
  predictionLikes?: number;
  /** Present when the authenticated user has liked this prediction. */
  userLike?: PredictionLike | null;
  /** The authenticated user's prediction for this prediction, when one exists. */
  userPrediction?: UserPrediction | null;
  comments?: Comment[];
}

export interface PredictionLike {
    id: number;
    user_id: number;
    prediction_id: number;
    created_at: string;
    updated_at: string;
}

export interface PredictionListParams {
    page?: number;
    paginate?: number;
    search?: string;
    sort?: string;
    topic_id?: number;
    prediction_id?: number;
    predictionId?: number;
}

export interface CreatePredictionData {
    title: string;
    text?: string;
    topic_id: number;
    category_id?: number;
    options: string[];
    tags?: string[];
    starts_at?: string;
}

export interface UpdatePredictionData {
    name?: string;
    email?: string;
    role?: string;
}

export interface PredictionOption {
    id: number;
    title: string;
    prediction_id: number;
    is_true: number;
    userPredictionsCount: number;
    myPrediction?: unknown;
}

export interface Tag {
    id: number;
    title: string;
    color: string;
}

export interface Comment {
    id?: number;
    user_id: number;
    parent_id: number | null;
    prediction_id: number;
    text: string;
    file: string | null;
    time_past: string;
    user: {
        username: string;
        mobile: string;
    } | null;
    childrenCount: number;
    likesCount: number;
    /** Present when the authenticated user has liked this comment. */
    userLike?: CommentLike | null;
    children?: Comment[];
}

export interface CommentLike {
    id: number;
    user_id: number;
    comment_id: number;
    created_at: string;
    updated_at: string;
}

export interface AddCommentData {
    prediction_id: number;
    text: string;
    file?: File;
    parent_id?: number | null;
}

export interface LikeCommentResponse {
    liked: boolean;
    likesCount: number;
}

/** Raw toggle payload; the API may return a summary or the full comment. */
export interface LikeCommentApiResponse {
    id?: number;
    liked?: boolean;
    is_liked?: boolean;
    isLiked?: boolean;
    likesCount?: number;
    userLike?: CommentLike | null;
    user_like?: CommentLike | null;
    comment?: Pick<Comment, 'likesCount' | 'userLike'> & {
        user_like?: CommentLike | null;
    };
}

export interface LikePredictionResponse {
    is_liked: boolean;
    likesCount: number;
}

/** Raw toggle payload; the API may return a summary or the full prediction. */
export interface LikePredictionApiResponse {
    is_liked?: boolean;
    isLiked?: boolean;
    likesCount?: number;
    predictionLikes?: number;
    prediction?: Pick<Prediction, 'predictionLikes' | 'userLike'> & {
        user_like?: PredictionLike | null;
    };
}

export interface ActivityLogData {
    action: string;
    meta?: Record<string, any>;
}

export interface Topic {
    id: number;
    title: string;
    icon?: string;
    status?: string;
    category_id?: number;
}

export interface SubmitPredictionData {
    prediction_option_id: number;
    comment?: {
        text?: string;
        file?: File;
    };
}

export interface SearchHistoryItem {
    id: number;
    user_id: number;
    searchable_type: string | null;
    searchable_id: number | null;
    search_text: string | null;
    searchable: Topic | Tag | null;
    created_at: string;
}

export interface SearchHistoryResponse {
    success: boolean;
    data: SearchHistoryItem[];
    message?: string;
}
