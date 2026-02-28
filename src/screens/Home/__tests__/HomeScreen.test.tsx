import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock useAuth
jest.mock('../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components', () => {
    const { View, Text } = require('react-native');
    return {
        Button: ({ children, onPress, testID }: any) => (
            <View testID={testID} onPress={onPress}>
                {typeof children === 'string' ? <Text>{children}</Text> : children}
            </View>
        ),
        Icon: () => null,
    };
});

import { View, Text } from 'react-native';

describe('HomeScreen', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    it('renders loading state when auth is loading', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loading: true,
            hasOnboarded: false,
        });

        const { getByText } = render(<HomeScreen />);
        expect(getByText('Loading...')).toBeTruthy();
    });

    it('renders home screen content when loaded', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loading: false,
            hasOnboarded: false,
        });

        const { getByText } = render(<HomeScreen />);
        expect(getByText('Pillara')).toBeTruthy();
        expect(getByText('Get Started')).toBeTruthy();
    });

    it('navigates to onboarding if not onboarded and Get Started is pressed', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loading: false,
            hasOnboarded: false,
        });

        const { getByText } = render(<HomeScreen />);
        fireEvent.press(getByText('Get Started'));

        expect(mockPush).toHaveBeenCalledWith('/onboarding');
    });

    it('navigates to login if onboarded and Get Started is pressed', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loading: false,
            hasOnboarded: true,
        });

        const { getByText } = render(<HomeScreen />);
        fireEvent.press(getByText('Get Started'));

        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('navigates to dashboard when Skip to Dashboard is pressed', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loading: false,
            hasOnboarded: true,
        });

        const { getByText } = render(<HomeScreen />);
        fireEvent.press(getByText('Skip to Dashboard'));

        expect(mockPush).toHaveBeenCalledWith('/(tabs)');
    });
});
