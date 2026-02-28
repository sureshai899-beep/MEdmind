import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const PRIVACY_STORAGE_KEY = '@pillara_privacy';

export interface PrivacySettings {
    biometricEnabled: boolean;
    lastAuthenticated?: string;
}

export function usePrivacy() {
    const [settings, setSettings] = useState<PrivacySettings>({ biometricEnabled: false });
    const [loading, setLoading] = useState(true);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        checkSupport();
        loadSettings();
    }, []);

    const checkSupport = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
    };

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(PRIVACY_STORAGE_KEY);
            if (stored) {
                setSettings(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading privacy settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBiometric = useCallback(async (enabled: boolean) => {
        if (enabled) {
            // Verify with biometrics before enabling
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Confirm identity to enable biometric lock',
                fallbackLabel: 'Enter Passcode',
            });

            if (!result.success) {
                return false;
            }
        }

        const newSettings = { ...settings, biometricEnabled: enabled };
        setSettings(newSettings);
        await AsyncStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(newSettings));
        return true;
    }, [settings]);

    const authenticate = async () => {
        if (!settings.biometricEnabled) return true;

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock Pillara',
            disableDeviceFallback: false,
        });

        return result.success;
    };

    return {
        settings,
        loading,
        isBiometricSupported,
        toggleBiometric,
        authenticate,
    };
}
