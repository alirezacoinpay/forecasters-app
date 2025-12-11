import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosError,
} from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { toast } from 'sonner';

class ApiClient {
    private client: AxiosInstance;
    private readonly baseURL: string;

    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL;

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
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                this.handleRequest(config);
                return config;
            },
            (error: any) => Promise.reject(this.handleError(error))
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                this.handleResponse(response);
                return response;
            },
            (error: AxiosError) => Promise.reject(this.handleError(error))
        );
    }

    private handleRequest(config: InternalAxiosRequestConfig): void {
        const token = this.getAuthToken();
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

    
    }

    private handleResponse(response: AxiosResponse): void {
      
    }

    private handleError(error: AxiosError | any): ApiError {
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An unknown error occurred',
            status: error.response?.status || 0,
            data: error.response?.data,
        };

        if (import.meta.env.DEV) {
            console.error('❌ API Error:', apiError);
        }

        this.handleErrorStatus(apiError);

        return apiError;
    }

    private handleErrorStatus(error: ApiError): void {
        switch (error.status) {
            case 400:
                // Validation errors - don't show generic toast, let components handle it
                // Components can access error.data.errors for field-specific messages
                if (import.meta.env.DEV) {
                    console.warn('Validation error:', error.data);
                }
                break;
            case 401:
                this.handleUnauthorized();
                toast.error('احراز هویت نامعتبر', {
                    description: 'لطفاً دوباره وارد شوید',
                    duration: 3000,
                });
                break;
            case 403:
                toast.error('دسترسی غیرمجاز', {
                    description: 'شما مجاز به انجام این عملیات نیستید',
                    duration: 3000,
                });
                break;
            case 404:
                toast.error('منبع مورد نظر یافت نشد', {
                    duration: 3000,
                });
                break;
            case 422:
                // Unprocessable entity - validation errors with details
                const validationErrors = error.data?.errors;
                if (validationErrors && typeof validationErrors === 'object') {
                    // Show first validation error
                    const firstError = Object.values(validationErrors)[0];
                    const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                    toast.error('خطا در اعتبارسنجی', {
                        description: errorMessage || 'لطفاً اطلاعات را بررسی کنید',
                        duration: 3000,
                    });
                } else {
                    toast.error('خطا در اعتبارسنجی', {
                        description: error.message || 'لطفاً اطلاعات را بررسی کنید',
                        duration: 3000,
                    });
                }
                break;
            case 500:
                toast.error('خطای سرور', {
                    description: 'لطفاً بعداً تلاش کنید',
                    duration: 3000,
                });
                break;
            default:
                if (error.message?.toLowerCase().includes('network') || error.status === 0) {
                    toast.error('خطای اتصال', {
                        description: 'اتصال اینترنت را بررسی کنید',
                        duration: 3000,
                    });
                } else if (error.status >= 400) {
                    toast.error('خطا در درخواست', {
                        description: error.message || 'لطفاً دوباره تلاش کنید',
                        duration: 3000,
                    });
                }
        }
    }

    private handleUnauthorized(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
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
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    onProgress(Math.round(progress));
                }
            },
        });

        // Axios response.data is of type ApiResponse<T>, so just return it
        return response.data;
    }

}

export const apiClient = new ApiClient();
