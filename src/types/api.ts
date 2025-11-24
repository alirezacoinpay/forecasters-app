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
  id: string;
  author: string;
  timestamp: string;
  question: string;
  description?: string;
  detailedDescription?: string;
  category: string;
  tags: Tag[];
  options: PredictionOption[];
  commentsCount: number;
  sharesCount: number;
  comments?: Comment[];
}

export interface PredictionListParams {
    page?: number;
    paginate?: number;
    search?: string;
    sort?: string;
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
    id: string;
    text: string;
    percentage: number;
    voters: number;
}

export interface Tag {
    id: string;
    label: string;
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    likes: number;
    replies: number;
    timestamp: string;
    avatar?: string;
}