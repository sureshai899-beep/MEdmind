import { renderHook, act } from '@testing-library/react-native';
import { usePrivacy } from '../usePrivacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('expo-local-authentication', () => ({
    hasHardwareAsync: jest.fn(),
    authenticateAsync: jest.fn(),
}));

describe('usePrivacy', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    });

    it('should check biometric support on mount', async () => {
        const { result } = renderHook(() => usePrivacy());
        await act(async () => { });
        expect(result.current.isBiometricSupported).toBe(true);
    });

    it('should toggle biometric and prompt for auth when enabling', async () => {
        (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true });
        const { result } = renderHook(() => usePrivacy());
        await act(async () => { });

        let success;
        await act(async () => {
            success = await result.current.toggleBiometric(true);
        });

        expect(success).toBe(true);
        expect(result.current.settings.biometricEnabled).toBe(true);
        expect(LocalAuthentication.authenticateAsync).toHaveBeenCalled();
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should not enable biometric if authentication fails', async () => {
        (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: false });
        const { result } = renderHook(() => usePrivacy());
        await act(async () => { });

        let success;
        await act(async () => {
            success = await result.current.toggleBiometric(true);
        });

        expect(success).toBe(false);
        expect(result.current.settings.biometricEnabled).toBe(false);
    });

    it('should disable biometric without prompt', async () => {
        // Initial state enabled
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ biometricEnabled: true }));
        const { result } = renderHook(() => usePrivacy());
        await act(async () => { });

        await act(async () => {
            await result.current.toggleBiometric(false);
        });

        expect(result.current.settings.biometricEnabled).toBe(false);
        expect(LocalAuthentication.authenticateAsync).not.toHaveBeenCalled();
    });

    it('should authenticate correctly using biometrics', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ biometricEnabled: true }));
        const { result } = renderHook(() => usePrivacy());
        await act(async () => { });

        (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true });
        const success = await result.current.authenticate();
        expect(success).toBe(true);
    });

    it('should skip authentication if disabled', async () => {
        const { result } = renderHook(() => usePrivacy());
        await act(async () => { });

        const success = await result.current.authenticate();
        expect(success).toBe(true);
        expect(LocalAuthentication.authenticateAsync).not.toHaveBeenCalled();
    });
});
