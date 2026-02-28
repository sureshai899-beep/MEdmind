import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { User } from '../utils/schemas';

// Re-export User type for consumers
export type { User };

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    hasOnboarded: boolean;
}

const ONBOARDED_STORAGE_KEY = '@pillara_onboarded';

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        hasOnboarded: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load auth state from storage
    const loadAuthState = useCallback(async () => {
        try {
            setLoading(true);
            const [user, token, onboarded] = await Promise.all([
                authService.getUser(),
                authService.getToken(),
                AsyncStorage.getItem(ONBOARDED_STORAGE_KEY),
            ]);

            if (user && token) {
                setAuthState({
                    user,
                    token,
                    isAuthenticated: true,
                    hasOnboarded: onboarded === 'true',
                });
            } else {
                setAuthState(prev => ({
                    ...prev,
                    hasOnboarded: onboarded === 'true',
                }));
            }
        } catch (err) {
            console.error('Error loading auth state:', err);
            setError('Failed to load authentication state');
        } finally {
            setLoading(false);
        }
    }, []);

    // loginWithGoogle
    const loginWithGoogle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.loginWithGoogle();

            if (result.success && result.user && result.token) {
                setAuthState(prev => ({
                    ...prev,
                    user: result.user!,
                    token: result.token!,
                    isAuthenticated: true,
                }));
                return { success: true };
            } else {
                throw new Error(result.error || 'Google login failed');
            }
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // loginWithPhone
    const loginWithPhone = useCallback(async (phoneNumber: string) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.loginWithPhone(phoneNumber);

            if (result.success) {
                return { success: true, verificationId: phoneNumber }; // In this implementation, phoneNumber is used as verification identifier
            } else {
                throw new Error(result.error || 'Failed to send OTP');
            }
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // verifyOTP
    const verifyOTP = useCallback(async (verificationId: string, code: string) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.verifyOTP(verificationId, code);

            if (result.success && result.user && result.token) {
                setAuthState(prev => ({
                    ...prev,
                    user: result.user!,
                    token: result.token!,
                    isAuthenticated: true,
                }));
                return { success: true };
            } else {
                throw new Error(result.error || 'Verification failed');
            }
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setAuthState(prev => ({
                ...prev,
                user: null,
                token: null,
                isAuthenticated: false,
            }));
        } catch (err) {
            console.error('Error during logout:', err);
            setError('Logout failed');
        }
    }, []);

    // Update user profile
    const updateUser = useCallback(async (updates: Partial<User>) => {
        try {
            if (!authState.user) {
                throw new Error('No user logged in');
            }

            const updatedUser = { ...authState.user, ...updates };
            await authService.saveUser(updatedUser);

            setAuthState(prev => ({
                ...prev,
                user: updatedUser,
            }));
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user');
            throw err;
        }
    }, [authState.user]);

    // Set onboarded status
    const setHasOnboarded = useCallback(async (value: boolean) => {
        try {
            await AsyncStorage.setItem(ONBOARDED_STORAGE_KEY, value ? 'true' : 'false');
            setAuthState(prev => ({ ...prev, hasOnboarded: value }));
        } catch (err) {
            console.error('Error saving onboarding state:', err);
        }
    }, []);

    // Load auth state on mount
    useEffect(() => {
        loadAuthState();
    }, [loadAuthState]);

    return {
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        hasOnboarded: authState.hasOnboarded,
        loading,
        error,
        loginWithGoogle,
        loginWithPhone,
        verifyOTP,
        logout,
        updateUser,
        setHasOnboarded,
    };
}
