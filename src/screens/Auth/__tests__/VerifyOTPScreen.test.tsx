import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { VerifyOTPScreen } from '../VerifyOTPScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock constants
jest.mock('../../../constants/Colors', () => ({
    colors: {
        text: { primary: '#000000' },
        background: { primary: '#FFFFFF' },
    },
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return {
        SafeAreaView: ({ children }: any) => <View>{children}</View>,
    };
});

// Mock components
jest.mock('../../../components', () => {
    const { View } = require('react-native');
    return {
        Icon: () => <View testID="icon" />,
    };
});

jest.mock('../../../components/form/FormInput', () => {
    const { View, Text, TextInput } = require('react-native');
    return {
        FormInput: ({ label, value, onChangeText, error, placeholder }: any) => (
            <View>
                <Text>{label}</Text>
                <TextInput
                    testID="otp-input"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                />
                {error && <Text testID="input-error">{error}</Text>}
            </View>
        ),
    };
});

jest.mock('../../../components/ui/Button', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return {
        Button: ({ children, onPress, loading, disabled }: any) => (
            <TouchableOpacity
                testID="verify-button"
                onPress={onPress}
                disabled={disabled || loading}
            >
                <Text>{loading ? 'Loading...' : children}</Text>
            </TouchableOpacity>
        ),
    };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('VerifyOTPScreen', () => {
    const mockRouter = { replace: jest.fn(), back: jest.fn() };
    const mockVerifyOTP = jest.fn();
    const mockParams = { verificationId: 'v123', phoneNumber: '1234567890' };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useLocalSearchParams as jest.Mock).mockReturnValue(mockParams);
        (useAuth as jest.Mock).mockReturnValue({
            verifyOTP: mockVerifyOTP,
            loading: false,
        });
    });

    it('renders correctly with phone number', () => {
        const { getByText, getByTestId } = render(<VerifyOTPScreen />);
        expect(getByText('Verify Identity')).toBeTruthy();
        expect(getByText(/1234567890/)).toBeTruthy();
        expect(getByTestId('otp-input')).toBeTruthy();
    });

    it('shows error if OTP is less than 6 digits', async () => {
        const { getByTestId, getByText } = render(<VerifyOTPScreen />);
        fireEvent.changeText(getByTestId('otp-input'), '12345');
        fireEvent.press(getByTestId('verify-button'));

        await waitFor(() => {
            expect(getByText('Enter the 6-digit code')).toBeTruthy();
        });
    });

    it('calls verifyOTP and navigates to tabs on success', async () => {
        mockVerifyOTP.mockResolvedValue({ success: true });
        const { getByTestId } = render(<VerifyOTPScreen />);

        fireEvent.changeText(getByTestId('otp-input'), '123456');
        fireEvent.press(getByTestId('verify-button'));

        await waitFor(() => {
            expect(mockVerifyOTP).toHaveBeenCalledWith('v123', '123456');
            expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
        });
    });

    it('shows Alert on failure', async () => {
        mockVerifyOTP.mockResolvedValue({ success: false, error: 'Invalid code' });
        const { getByTestId } = render(<VerifyOTPScreen />);

        fireEvent.changeText(getByTestId('otp-input'), '123456');
        fireEvent.press(getByTestId('verify-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Verification Failed', 'Invalid code');
        });
    });

    it('goes back when back button or resend code is pressed', () => {
        const { getByTestId, getByText } = render(<VerifyOTPScreen />);

        fireEvent.press(getByTestId('back-button'));
        expect(mockRouter.back).toHaveBeenCalledTimes(1);

        fireEvent.press(getByText('Resend Code'));
        expect(mockRouter.back).toHaveBeenCalledTimes(2);
    });
});
