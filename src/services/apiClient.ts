import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { captureException, addBreadcrumb } from './sentry';

/**
 * API Client Configuration
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.pillara.app/v1';
const TOKEN_KEY = '@pillara_token';

/**
 * API Client with interceptors for auth, error handling, and logging
 */
class ApiClient {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        this.setupInterceptors();
        this.loadToken();
    }

    /**
     * Load auth token from storage
     */
    private async loadToken() {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                this.token = token;
            }
        } catch (error) {
            console.error('Failed to load token:', error);
        }
    }

    /**
     * Set auth token
     */
    async setToken(token: string | null) {
        this.token = token;
        if (token) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            async (config) => {
                // Add auth token
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }

                // Add breadcrumb for tracking
                addBreadcrumb({
                    message: `API Request: ${config.method?.toUpperCase()} ${config.url}`,
                    category: 'api',
                    level: 'info',
                    data: {
                        method: config.method,
                        url: config.url,
                    },
                });

                return config;
            },
            (error) => {
                captureException(error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                // Transform snake_case to camelCase
                if (response.data && typeof response.data === 'object') {
                    response.data = this.snakeToCamel(response.data);
                }

                // Log successful response
                addBreadcrumb({
                    message: `API Response: ${response.status} ${response.config.url}`,
                    category: 'api',
                    level: 'info',
                    data: {
                        status: response.status,
                        url: response.config.url,
                    },
                });

                return response;
            },
            async (error: AxiosError) => {
                // Handle 401 Unauthorized - token expired
                if (error.response?.status === 401) {
                    await this.setToken(null);
                    // TODO: Redirect to login or refresh token
                }

                // Log error
                addBreadcrumb({
                    message: `API Error: ${error.response?.status} ${error.config?.url}`,
                    category: 'api',
                    level: 'error',
                    data: {
                        status: error.response?.status,
                        url: error.config?.url,
                        error: error.message,
                    },
                });

                captureException(error);

                return Promise.reject(error);
            }
        );
    }

    /**
     * Recursive utility to convert snake_case object keys to camelCase
     */
    private snakeToCamel(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(v => this.snakeToCamel(v));
        } else if (obj !== null && obj.constructor === Object) {
            return Object.keys(obj).reduce(
                (result, key) => ({
                    ...result,
                    [key.replace(/(_\w)/g, m => m[1].toUpperCase())]: this.snakeToCamel(obj[key]),
                }),
                {},
            );
        }
        return obj;
    }

    /**
     * Recursive utility to convert camelCase object keys to snake_case
     */
    private camelToSnake(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(v => this.camelToSnake(v));
        } else if (obj !== null && obj.constructor === Object && !(obj instanceof FormData)) {
            return Object.keys(obj).reduce(
                (result, key) => ({
                    ...result,
                    [key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)]: this.camelToSnake(obj[key]),
                }),
                {},
            );
        }
        return obj;
    }

    /**
     * GET request
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * POST request
     */
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const payload = this.camelToSnake(data);
        const response = await this.client.post<T>(url, payload, config);
        return response.data;
    }

    /**
     * PUT request
     */
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const payload = this.camelToSnake(data);
        const response = await this.client.put<T>(url, payload, config);
        return response.data;
    }

    /**
     * PATCH request
     */
    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const payload = this.camelToSnake(data);
        const response = await this.client.patch<T>(url, payload, config);
        return response.data;
    }

    /**
     * DELETE request
     */
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    /**
     * Upload file
     */
    async upload<T = any>(url: string, file: File | Blob, onProgress?: (progress: number) => void): Promise<T> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.client.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        });

        return response.data;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

/**
 * API Endpoints
 */
export const API = {
    // Authentication
    auth: {
        loginGoogle: (token: string) => apiClient.post('/auth/google', { token }),
        loginPhone: (phoneNumber: string) => apiClient.post('/auth/phone/send-otp', { phoneNumber }),
        verifyOTP: (phoneNumber: string, code: string) => apiClient.post('/auth/phone/verify', { phoneNumber, code }),
        logout: () => apiClient.post('/auth/logout'),
        refreshToken: () => apiClient.post('/auth/refresh'),
    },

    // Medications
    medications: {
        list: () => apiClient.get('/medications'),
        get: (id: string) => apiClient.get(`/medications/${id}`),
        create: (data: any) => apiClient.post('/medications', data),
        update: (id: string, data: any) => apiClient.put(`/medications/${id}`, data),
        delete: (id: string) => apiClient.delete(`/medications/${id}`),
        search: (query: string) => apiClient.get(`/medications/search?q=${query}`),
    },

    // Doses
    doses: {
        list: () => apiClient.get('/doses'),
        log: (data: any) => apiClient.post('/doses', data),
        update: (id: string, data: any) => apiClient.put(`/doses/${id}`, data),
        adherence: (days: number) => apiClient.get(`/doses/adherence?days=${days}`),
    },

    // User Profile
    profile: {
        get: () => apiClient.get('/profile'),
        update: (data: any) => apiClient.put('/profile', data),
        updateHealth: (data: any) => apiClient.put('/profile/health', data),
        updatePreferences: (data: any) => apiClient.put('/profile/preferences', data),
    },

    // OCR / Scanning
    scan: {
        uploadImage: (file: File | Blob, onProgress?: (progress: number) => void) =>
            apiClient.upload('/scan/upload', file, onProgress),
        processImage: (imageId: string) => apiClient.post(`/scan/process/${imageId}`),
    },

    // Drug Database
    drugs: {
        search: (query: string) => apiClient.get(`/drugs/search?q=${query}`),
        details: (drugId: string) => apiClient.get(`/drugs/${drugId}`),
        interactions: (drugIds: string[]) =>
            apiClient.post('/drugs/interactions', { drugIds }),
    },

    // Community Posts
    posts: {
        list: () => apiClient.get('/posts'),
        create: (data: any) => apiClient.post('/posts', data),
        uploadImage: (id: string, file: File | Blob) => apiClient.upload(`/posts/${id}/image`, file),
    },
};

export default apiClient;
