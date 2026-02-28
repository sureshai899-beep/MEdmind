import * as Sentry from '@sentry/react-native';

/**
 * Initialize Sentry for error tracking
 */
export function initSentry() {
    // Only initialize in production
    if (__DEV__) {
        console.log('Sentry disabled in development mode');
        return;
    }

    Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE',

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.2,

        // Enable automatic session tracking
        enableAutoSessionTracking: true,

        // Session timeout in milliseconds
        sessionTrackingIntervalMillis: 30000,

        // Enable native crash reporting
        enableNative: true,

        // Enable automatic breadcrumbs
        enableAutoPerformanceTracing: true,

        // Attach stack trace to messages
        attachStacktrace: true,

        // Environment
        environment: __DEV__ ? 'development' : 'production',

        // Release version
        release: 'pillara@1.0.0',

        // Before send hook - filter sensitive data
        beforeSend(event, hint) {
            // Filter out sensitive information
            if (event.request?.data) {
                // Remove password fields
                if (typeof event.request.data === 'object') {
                    delete event.request.data.password;
                    delete event.request.data.token;
                }
            }

            // Log to console in development
            if (__DEV__) {
                console.log('Sentry Event:', event);
                console.log('Sentry Hint:', hint);
            }

            return event;
        },

        // Ignore certain errors
        ignoreErrors: [
            // Network errors
            'Network request failed',
            'NetworkError',
            // Timeout errors
            'timeout',
            // Cancelled requests
            'cancelled',
            'AbortError',
        ],
    });

    console.log('Sentry initialized successfully');
}

/**
 * Capture an exception manually
 */
export function captureException(error: Error, context?: Record<string, any>) {
    if (__DEV__) {
        console.error('Sentry Exception:', error, context);
        return;
    }

    Sentry.captureException(error, {
        contexts: context ? { custom: context } : undefined,
    });
}

/**
 * Capture a message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    if (__DEV__) {
        console.log(`Sentry Message [${level}]:`, message);
        return;
    }

    Sentry.captureMessage(message, level);
}

/**
 * Set user context
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
    Sentry.setUser(user);
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
}) {
    Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Set custom context
 */
export function setContext(name: string, context: Record<string, any>) {
    Sentry.setContext(name, context);
}

/**
 * Set tag
 */
export function setTag(key: string, value: string) {
    Sentry.setTag(key, value);
}

/**
 * Wrap a function with Sentry error tracking
 */
export function withSentry<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => {
        try {
            const result = fn(...args);

            // Handle async functions
            if (result instanceof Promise) {
                return result.catch((error) => {
                    captureException(error);
                    throw error;
                });
            }

            return result;
        } catch (error) {
            captureException(error as Error);
            throw error;
        }
    }) as T;
}

export { Sentry };
