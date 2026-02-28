import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

/**
 * Protected route hook
 * Redirects to login if user is not authenticated
 */
export function useProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(tabs)';

        if (!isAuthenticated && inAuthGroup) {
            // Redirect to login if trying to access protected routes
            router.replace('/login');
        } else if (isAuthenticated && !inAuthGroup) {
            // Redirect to app if already authenticated
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, loading, segments]);
}

/**
 * Require authentication for a component
 */
export function withAuth<P extends object>(
    Component: React.ComponentType<P>
): React.ComponentType<P> {
    return function AuthenticatedComponent(props: P) {
        useProtectedRoute();
        return <Component {...props} />;
    };
}
