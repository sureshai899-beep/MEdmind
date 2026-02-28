import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../authService';
import { API } from '../apiClient';
import { UserSchema } from '../../utils/schemas';

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('../apiClient', () => ({
    API: {
        auth: {
            logout: jest.fn(),
            loginGoogle: jest.fn(),
            verifyOTP: jest.fn(),
        },
    },
}));

describe('authService', () => {
    const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getToken', () => {
        it('should retrieve token from SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('fake-token');
            const token = await authService.getToken();
            expect(token).toBe('fake-token');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('@pillara_token');
        });
    });

    describe('saveToken', () => {
        it('should save token to SecureStore', async () => {
            await authService.saveToken('new-token');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@pillara_token', 'new-token');
        });
    });

    describe('getUser', () => {
        it('should return null if no user is found', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
            const user = await authService.getUser();
            expect(user).toBeNull();
        });

        it('should return parsed user from SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
            const user = await authService.getUser();
            expect(user).toEqual(mockUser);
        });

        it('should fallback to AsyncStorage if SecureStore fails and migrate data', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('SecureStore error'));
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

            const user = await authService.getUser();

            expect(user).toEqual(mockUser);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@pillara_user', JSON.stringify(mockUser));
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@pillara_user');
        });

        it('should return null if both stores fail or data is invalid', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');

            const user = await authService.getUser();
            expect(user).toBeNull();
        });
    });

    describe('logout', () => {
        it('should clear local state and call API logout', async () => {
            await authService.logout();

            expect(API.auth.logout).toHaveBeenCalled();
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@pillara_token');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@pillara_user');
        });

        it('should clear local state even if API logout fails', async () => {
            (API.auth.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

            await authService.logout();

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@pillara_token');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@pillara_user');
        });
    });

    describe('loginWithGoogle', () => {
        it('should handle successful Google login', async () => {
            const mockResponse = { user: mockUser, token: 'fake-token' };
            (API.auth.loginGoogle as jest.Mock).mockResolvedValue(mockResponse);

            const result = await authService.loginWithGoogle();

            expect(result.success).toBe(true);
            expect(result.user).toEqual(mockUser);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@pillara_user', JSON.stringify(mockUser));
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@pillara_token', 'fake-token');
        });

        it('should handle Google login failure', async () => {
            (API.auth.loginGoogle as jest.Mock).mockRejectedValue(new Error('Auth failed'));

            const result = await authService.loginWithGoogle();

            expect(result.success).toBe(false);
            expect(result.error).toBe('Auth failed');
        });
    });

    describe('verifyOTP', () => {
        it('should handle successful OTP verification', async () => {
            const mockResponse = { user: mockUser, token: 'otp-token' };
            (API.auth.verifyOTP as jest.Mock).mockResolvedValue(mockResponse);

            const result = await authService.verifyOTP('vid-123', '123456');

            expect(result.success).toBe(true);
            expect(result.user).toEqual(mockUser);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@pillara_user', JSON.stringify(mockUser));
        });

        it('should handle invalid OTP', async () => {
            (API.auth.verifyOTP as jest.Mock).mockResolvedValue({ success: false });

            const result = await authService.verifyOTP('vid-123', 'wrong');

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
});
