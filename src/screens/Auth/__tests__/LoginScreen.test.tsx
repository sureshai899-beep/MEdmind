import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    Link: ({ children }: any) => children,
}));

// Mock useAuth
jest.mock('../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components', () => ({
    Icon: 'Icon',
}));
jest.mock('../../../components/auth/SocialButtons', () => ({
    SocialButtons: ({ onGooglePress, onPhonePress }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <>
                <TouchableOpacity testID="google-login" onPress={onGooglePress}><Text>Google</Text></TouchableOpacity>
                <TouchableOpacity testID="phone-login" onPress={onPhonePress}><Text>Phone</Text></TouchableOpacity>
            </>
        );
    },
}));

describe('LoginScreen', () => {
    const mockReplace = jest.fn();
    const mockPush = jest.fn();
    const mockLoginWithGoogle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
            push: mockPush,
        });
        (useAuth as jest.Mock).mockReturnValue({
            loginWithGoogle: mockLoginWithGoogle,
            loading: false,
        });
        jest.spyOn(Alert, 'alert');
    });

    it('should render correctly', () => {
        const { getByText } = render(<LoginScreen />);
        expect(getByText('Welcome to Pillara')).toBeTruthy();
        expect(getByText('Skip for now')).toBeTruthy();
    });

    it('should handle successful google login', async () => {
        mockLoginWithGoogle.mockResolvedValue({ success: true });
        const { getByTestId } = render(<LoginScreen />);

        fireEvent.press(getByTestId('google-login'));

        await waitFor(() => {
            expect(mockLoginWithGoogle).toHaveBeenCalled();
            expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
        });
    });

    it('should handle failed google login', async () => {
        mockLoginWithGoogle.mockResolvedValue({ success: false, error: 'Network Error' });
        const { getByTestId } = render(<LoginScreen />);

        fireEvent.press(getByTestId('google-login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Google Login Failed', 'Network Error');
        });
    });

    it('should navigate to phone login', () => {
        const { getByTestId } = render(<LoginScreen />);

        fireEvent.press(getByTestId('phone-login'));

        expect(mockPush).toHaveBeenCalledWith('/phone-login');
    });
});
