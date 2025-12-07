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
    token: string;
    refreshToken: string;
    user: User;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt: string;
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
  questionForwardCount: number;
  user: {
    username: string;
    mobile: string;
  } | null;
  tags: Tag[];
  questionOptions: PredictionOption[];
  comments?: Comment[];
}

export interface PredictionListParams {
    page?: number;
    paginate?: number;
    search?: string;
    sort?: string;
    topic_id?: number;
}

export interface CreatePredictionData {
    name?: string;
    email?: string;
    role?: string;
}

export interface UpdatePredictionData {
    name?: string;
    email?: string;
    role?: string;
}

export interface PredictionOption {
    id: number;
    title: string;
    question_id: number;
    is_true: number;
    userPredictionsCount: number;
}

export interface Tag {
    id: number;
    title: string;
    color: string;
}

export interface Comment {
    user_id: number;
    parent_id: number | null;
    question_id: number;
    text: string;
    file: string | null;
    time_past: string;
    user: {
        username: string;
        mobile: string;
    } | null;
    childrenCount: number;
    likesCount: number;
    children?: Comment[];
}

export interface Topic {
    id: number;
    title: string;
    category_id?: number;
}
