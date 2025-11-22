import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../types/api';

class ApiClient {
    private client: AxiosInstance;
    private readonly baseURL: string;

    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                this.handleRequest(config);
                return config;
            },
            (error: any) => {
                return Promise.reject(this.handleError(error));
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                this.handleResponse(response);
                return response;
            },
            (error: any) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleRequest(config: InternalAxiosRequestConfig): void {
        // Add auth token to headers
        const token = this.getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.VITE_API_BASE_URL) {
            console.log('📤 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
                params: config.params,
            });
        }
    }

    private handleResponse(response: AxiosResponse): void {
        // Log response in development
        if (import.meta.env.VITE_API_BASE_URL) {
            console.log('📥 API Response:', {
                status: response.status,
                data: response.data,
                url: response.config.url,
            });
        }
    }

    private handleError(error: any): ApiError {
        // Enhanced error handling
        const apiError: ApiError = {
            message: error.message || 'An unknown error occurred',
            status: error.response?.status || 0,
            code: error.code,
            details: error.response?.data,
        };

        // Log error in development
        if (import.meta.env.VITE_API_BASE_URL) {
            console.error('❌ API Error:', apiError);
        }

        // Handle specific status codes
        this.handleErrorStatus(apiError);

        return apiError;
    }

    private handleErrorStatus(error: ApiError): void {
        switch (error.status) {
            case 401:
                this.handleUnauthorized();
                break;
            case 403:
                console.error('دسترسی غیرمجاز');
                break;
            case 404:
                console.error('منبع مورد نظر یافت نشد');
                break;
            case 500:
                console.error('خطای سرور داخلی');
                break;
            default:
                if (error.code === 'NETWORK_ERROR') {
                    console.error('خطای شبکه - اتصال اینترنت را بررسی کنید');
                }
        }
    }

    private handleUnauthorized(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page
        window.location.href = '/login';
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Public methods
    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.put<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        return response.data;
    }

    public async upload<T = any>(
        url: string,
        formData: FormData,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent: { total: number; loaded: number; }) => {
                if (onProgress && progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    onProgress(Math.round(progress));
                }
            },
        });
        return response.data;
    }
}

export const apiClient = new ApiClient();