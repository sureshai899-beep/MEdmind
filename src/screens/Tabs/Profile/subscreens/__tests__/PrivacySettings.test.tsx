import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PrivacySettingsScreen } from '../PrivacySettings';
import { useRouter } from 'expo-router';
import { usePrivacy } from '../../../../../hooks/usePrivacy';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../../../hooks/usePrivacy', () => ({
    usePrivacy: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../../../components', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('PrivacySettingsScreen', () => {
    const mockRouter = { back: jest.fn() };
    const mockToggleBiometric = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (usePrivacy as jest.Mock).mockReturnValue({
            settings: { biometricEnabled: false },
            loading: false,
            isBiometricSupported: true,
            toggleBiometric: mockToggleBiometric,
        });
    });

    it('renders biometric toggle correctly', () => {
        const { getByText, getByRole } = render(<PrivacySettingsScreen />);

        expect(getByText('Biometric Lock')).toBeTruthy();
        const toggle = getByRole('switch');
        expect(toggle.props.value).toBe(false);
    });

    it('shows warning if biometrics not supported', () => {
        (usePrivacy as jest.Mock).mockReturnValue({
            settings: { biometricEnabled: false },
            loading: false,
            isBiometricSupported: false,
            toggleBiometric: mockToggleBiometric,
        });

        const { getByText, getByTestId } = render(<PrivacySettingsScreen />);

        expect(getByText(/Biometric hardware not detected/)).toBeTruthy();
        expect(getByTestId('icon-warning')).toBeTruthy();
    });

    it('handles biometric toggle success', async () => {
        mockToggleBiometric.mockResolvedValue(true);
        const { getByRole } = render(<PrivacySettingsScreen />);
        const toggle = getByRole('switch');

        fireEvent(toggle, 'onValueChange', true);

        expect(mockToggleBiometric).toHaveBeenCalledWith(true);
    });

    it('handles biometric toggle failure and shows alert', async () => {
        mockToggleBiometric.mockResolvedValue(false);
        const { getByRole } = render(<PrivacySettingsScreen />);
        const toggle = getByRole('switch');

        await waitFor(() => {
            fireEvent(toggle, 'onValueChange', true);
        });

        expect(Alert.alert).toHaveBeenCalledWith('Authentication Failed', expect.any(String));
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<PrivacySettingsScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
