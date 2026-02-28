/**
 * Centralized error handling utility
 */
import * as Sentry from '../services/sentry';

export interface AppError {
    message: string;
    code?: string;
    statusCode?: number;
    originalError?: any;
}

/**
 * Error types for categorization
 */
export enum ErrorType {
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    AUTHENTICATION = 'AUTHENTICATION',
    AUTHORIZATION = 'AUTHORIZATION',
    NOT_FOUND = 'NOT_FOUND',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Parse API errors into user-friendly messages
 */
export function parseApiError(error: any): AppError {
    // Network error
    if (!error.response) {
        return {
            message: 'Unable to connect to the server. Please check your internet connection.',
            code: ErrorType.NETWORK,
        };
    }

    const { status, data } = error.response;

    // Authentication errors
    if (status === 401) {
        return {
            message: 'Your session has expired. Please log in again.',
            code: ErrorType.AUTHENTICATION,
            statusCode: status,
        };
    }

    // Authorization errors
    if (status === 403) {
        return {
            message: 'You don\'t have permission to perform this action.',
            code: ErrorType.AUTHORIZATION,
            statusCode: status,
        };
    }

    // Not found errors
    if (status === 404) {
        return {
            message: 'The requested resource was not found.',
            code: ErrorType.NOT_FOUND,
            statusCode: status,
        };
    }

    // Validation errors
    if (status === 400 || status === 422) {
        const message = data?.message || 'Invalid data provided. Please check your input.';
        return {
            message,
            code: ErrorType.VALIDATION,
            statusCode: status,
            originalError: data,
        };
    }

    // Server errors
    if (status >= 500) {
        return {
            message: 'A server error occurred. Please try again later.',
            code: ErrorType.SERVER,
            statusCode: status,
        };
    }

    // Default error
    return {
        message: data?.message || 'An unexpected error occurred. Please try again.',
        code: ErrorType.UNKNOWN,
        statusCode: status,
        originalError: error,
    };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.message) {
        return error.message;
    }

    if (error?.response) {
        return parseApiError(error).message;
    }

    return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error to console (and optionally to external service)
 */
export function logError(error: any, context?: string) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);

    // Send to Sentry in production
    if (!__DEV__) {
        try {
            if (context) {
                Sentry.addBreadcrumb({
                    message: `Error in ${context}`,
                    category: 'error',
                    level: 'error',
                });
            }
            Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
        } catch (err) {
            console.error('Failed to send error to Sentry:', err);
        }
    }
}

/**
 * Handle async errors with try-catch wrapper
 */
export async function handleAsyncError<T>(
    fn: () => Promise<T>,
    errorMessage?: string
): Promise<{ data: T | null; error: AppError | null }> {
    try {
        const data = await fn();
        return { data, error: null };
    } catch (err) {
        const error = parseApiError(err);
        if (errorMessage) {
            error.message = errorMessage;
        }
        logError(err);
        return { data: null, error };
    }
}

/**
 * Validation error helper
 */
export function createValidationError(message: string): AppError {
    return {
        message,
        code: ErrorType.VALIDATION,
    };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
    return !error?.response || error?.code === 'NETWORK_ERROR';
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
    return error?.response?.status === 401 || error?.code === ErrorType.AUTHENTICATION;
}

/**
 * Format error for display
 */
export function formatErrorForDisplay(error: any): {
    title: string;
    message: string;
    icon: string;
} {
    const appError = typeof error === 'object' && error.code
        ? error
        : parseApiError(error);

    const errorMap: Record<ErrorType, { title: string; icon: string }> = {
        [ErrorType.NETWORK]: {
            title: 'Connection Error',
            icon: '📡',
        },
        [ErrorType.VALIDATION]: {
            title: 'Invalid Input',
            icon: '⚠️',
        },
        [ErrorType.AUTHENTICATION]: {
            title: 'Authentication Required',
            icon: '🔒',
        },
        [ErrorType.AUTHORIZATION]: {
            title: 'Access Denied',
            icon: '🚫',
        },
        [ErrorType.NOT_FOUND]: {
            title: 'Not Found',
            icon: '🔍',
        },
        [ErrorType.SERVER]: {
            title: 'Server Error',
            icon: '🔧',
        },
        [ErrorType.UNKNOWN]: {
            title: 'Error',
            icon: '❌',
        },
    };

    const errorType = (appError.code as ErrorType) || ErrorType.UNKNOWN;
    const { title, icon } = errorMap[errorType];

    return {
        title,
        message: appError.message,
        icon,
    };
}
