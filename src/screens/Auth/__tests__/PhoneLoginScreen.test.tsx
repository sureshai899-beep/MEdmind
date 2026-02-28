import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PhoneLoginScreen } from '../PhoneLoginScreen';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
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
                    testID="phone-input"
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
                testID="submit-button"
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

describe('PhoneLoginScreen', () => {
    const mockRouter = { push: jest.fn(), back: jest.fn() };
    const mockLoginWithPhone = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({
            loginWithPhone: mockLoginWithPhone,
            loading: false,
        });
    });

    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<PhoneLoginScreen />);
        expect(getByText('Phone Login')).toBeTruthy();
        expect(getByTestId('phone-input')).toBeTruthy();
    });

    it('shows error if phone number is empty', async () => {
        const { getByTestId, getByText } = render(<PhoneLoginScreen />);
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(getByText('Phone number is required')).toBeTruthy();
        });
    });

    it('shows error if phone number is too short', async () => {
        const { getByTestId, getByText } = render(<PhoneLoginScreen />);
        fireEvent.changeText(getByTestId('phone-input'), '12345');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(getByText('Please enter a valid phone number')).toBeTruthy();
        });
    });

    it('calls loginWithPhone and navigates on success', async () => {
        mockLoginWithPhone.mockResolvedValue({ success: true, verificationId: 'v123' });
        const { getByTestId } = render(<PhoneLoginScreen />);

        fireEvent.changeText(getByTestId('phone-input'), '1234567890');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(mockLoginWithPhone).toHaveBeenCalledWith('1234567890');
            expect(mockRouter.push).toHaveBeenCalledWith({
                pathname: '/verify-otp',
                params: {
                    verificationId: 'v123',
                    phoneNumber: '1234567890'
                }
            });
        });
    });

    it('shows Alert on failure', async () => {
        mockLoginWithPhone.mockResolvedValue({ success: false, error: 'Network error' });
        const { getByTestId } = render(<PhoneLoginScreen />);

        fireEvent.changeText(getByTestId('phone-input'), '1234567890');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
        });
    });

    it('goes back when the back button is pressed', () => {
        const { getByTestId } = render(<PhoneLoginScreen />);
        const backButton = getByTestId('back-button');
        fireEvent.press(backButton);
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
