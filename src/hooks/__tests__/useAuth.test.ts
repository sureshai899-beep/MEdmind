import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../services/authService', () => ({
    authService: {
        getUser: jest.fn(),
        getToken: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        verifyOTP: jest.fn(),
        saveUser: jest.fn(),
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('useAuth', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should load initial auth state from storage', async () => {
        (authService.getUser as jest.Mock).mockResolvedValue({ id: '1', name: 'Test User' });
        (authService.getToken as jest.Mock).mockResolvedValue('test-token');
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

        const { result } = renderHook(() => useAuth());

        // Wait for the initial load
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.user).toEqual({ id: '1', name: 'Test User' });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.hasOnboarded).toBe(true);
    });

    it('should handle loginWithGoogle success', async () => {
        (authService.loginWithGoogle as jest.Mock).mockResolvedValue({
            success: true,
            user: { id: '1', name: 'Test User' },
            token: 'test-token',
        });

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            const loginResult = await result.current.loginWithGoogle();
            expect(loginResult.success).toBe(true);
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.name).toBe('Test User');
    });

    it('should handle logout', async () => {
        (authService.getUser as jest.Mock).mockResolvedValue({ id: '1' });
        (authService.getToken as jest.Mock).mockResolvedValue('token');

        const { result } = renderHook(() => useAuth());

        // Wait for initial load
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        await act(async () => {
            await result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(authService.logout).toHaveBeenCalled();
    });
});
