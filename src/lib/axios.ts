import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosError,
} from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { toast } from 'sonner';
import { getTranslation } from '../lang';

class ApiClient {
    private client: AxiosInstance;
    private readonly baseURL: string;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (error?: any) => void;
    }> = [];

    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL;

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Enable cookies for session-based authentication
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                this.handleRequest(config);
                return config;
            },
            (error: any) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                this.handleResponse(response);
                return response;
            },
            async (error: AxiosError) => {
                try {
                    // handleError will either return a response (from retry) or reject with error
                    return await this.handleError(error);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        );
    }

    private handleRequest(config: InternalAxiosRequestConfig): void {
        // Cookies are automatically sent with requests when withCredentials is true
        // No need to manually add Authorization header for cookie-based sessions
    }

    private handleResponse(response: AxiosResponse): void {
      
    }

    private async handleError(error: AxiosError | any): Promise<any> {
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An unknown error occurred',
            status: error.response?.status || 0,
            data: error.response?.data,
        };

        // Handle 401/403 by automatically logging in
        if (apiError.status === 401 || apiError.status === 403) {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
            
            // Prevent infinite loops - don't retry if this is already a retry or if it's the login/me endpoint
            if (originalRequest && !originalRequest._retry && 
                originalRequest.url !== '/login' && 
                originalRequest.url !== '/me') {
                
                originalRequest._retry = true;

                // If we're already refreshing, queue this request
                if (this.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    }).then(() => {
                        return this.client(originalRequest);
                    }).catch((err) => {
                        return Promise.reject(err);
                    });
                }

                this.isRefreshing = true;

                try {
                    // Automatically login (calls /login with no body) - silently
                    await this.client.post('/login', {});
                    
                    // Process queued requests
                    this.processQueue(null);
                    
                    // Retry the original request - return the response
                    return this.client(originalRequest);
                } catch (loginError: any) {
                    // Login failed, reject queued requests
                    this.processQueue(loginError);
                    
                    // Don't show error toast for automatic login failures
                    if (import.meta.env.DEV) {
                        console.warn('Automatic login failed:', loginError);
                    }
                    
                    // Continue to show the original error
                    this.handleErrorStatus(apiError);
                    return Promise.reject(apiError);
                } finally {
                    this.isRefreshing = false;
                }
            }
        }

        if (import.meta.env.DEV) {
            console.error('❌ API Error:', apiError);
        }

        this.handleErrorStatus(apiError);

        return Promise.reject(apiError);
    }

    private processQueue(error: any): void {
        this.failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve();
            }
        });
        this.failedQueue = [];
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
                // Don't show toast for 401 - automatic login will handle it silently
                // Only show toast if automatic login already failed (handled in handleError)
                break;
            case 403:
                // Don't show toast for 403 - automatic login will handle it silently
                // Only show toast if automatic login already failed (handled in handleError)
                break;
            case 404:
                toast.error(getTranslation('errors.notFound'), {
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
                    toast.error(getTranslation('errors.validation'), {
                        description: errorMessage || getTranslation('errors.checkInfo'),
                        duration: 3000,
                    });
                } else {
                    toast.error(getTranslation('errors.validation'), {
                        description: error.message || getTranslation('errors.checkInfo'),
                        duration: 3000,
                    });
                }
                break;
            case 500:
                toast.error(getTranslation('errors.server'), {
                    description: getTranslation('errors.tryLater'),
                    duration: 3000,
                });
                break;
            default:
                if (error.message?.toLowerCase().includes('network') || error.status === 0) {
                    toast.error(getTranslation('errors.network'), {
                        description: getTranslation('errors.checkInternet'),
                        duration: 3000,
                    });
                } else if (error.status >= 400) {
                    toast.error(getTranslation('errors.request'), {
                        description: error.message || getTranslation('errors.tryAgain'),
                        duration: 3000,
                    });
                }
        }
    }

    private handleUnauthorized(): void {
        // With cookie-based sessions, we don't need to clear localStorage
        // The session cookie will be cleared by the backend on logout
        // For 401 errors, we'll let the auto-auth hook handle re-authentication
        // Don't redirect to /login since we have automatic authentication
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
