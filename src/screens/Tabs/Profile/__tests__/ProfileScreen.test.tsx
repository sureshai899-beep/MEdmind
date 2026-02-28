import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ProfileScreen } from '../ProfileScreen';
import { useRouter } from 'expo-router';
import { useProfile } from '../../../../hooks/useProfile';
import { useAuth } from '../../../../hooks/useAuth';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock expo-font
jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return {
        SafeAreaView: ({ children }: any) => <View>{children}</View>,
        SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
        useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
    };
});

// Mock hooks
jest.mock('../../../../hooks/useProfile', () => ({
    useProfile: jest.fn(),
}));

jest.mock('../../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../../components', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        ProfileHeader: ({ name, email }: any) => (
            <View>
                <Text>{name}</Text>
                <Text>{email}</Text>
            </View>
        ),
        ListItem: ({ title, onPress }: any) => (
            <TouchableOpacity onPress={onPress}>
                <Text>{title}</Text>
            </TouchableOpacity>
        ),
        CaregiverInvitationModal: ({ caregiverName, onClose }: any) => (
            <View>
                <Text>{caregiverName}</Text>
                <TouchableOpacity onPress={onClose} testID="close-caregiver-modal">
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        ),
        Icon: () => null,
    };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ProfileScreen', () => {
    const mockRouter = { push: jest.fn(), replace: jest.fn() };
    const mockLogout = jest.fn();
    const mockProfile = {
        personalInfo: {
            name: 'Jane Doe',
            email: 'jane@example.com',
            profilePictureUrl: 'avatar-uri',
        },
        isPremium: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useProfile as jest.Mock).mockReturnValue({ profile: mockProfile });
        (useAuth as jest.Mock).mockReturnValue({
            user: { name: 'John Doe', email: 'john@example.com' },
            logout: mockLogout,
        });
    });

    it('renders profile information from auth user', () => {
        const { getByText } = render(<ProfileScreen />);
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('john@example.com')).toBeTruthy();
    });

    it('renders profile information from profile hook if auth user is missing', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: null,
            logout: mockLogout,
        });

        const { getByText } = render(<ProfileScreen />);
        expect(getByText('Jane Doe')).toBeTruthy();
        expect(getByText('jane@example.com')).toBeTruthy();
    });

    it('navigates to personal info on ListItem press', () => {
        const { getByText } = render(<ProfileScreen />);
        fireEvent.press(getByText('Personal Information'));
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/personal-info');
    });

    it('opens caregiver modal on ListItem press', () => {
        const { getByText, queryByText } = render(<ProfileScreen />);

        // Initial state: modal content not visible (it's inside Modal which might be hidden by mock or just not rendered)
        // But since we mocked CaregiverInvitationModal, we can check if it renders when state changes.
        fireEvent.press(getByText('Add Caregiver'));
        expect(getByText('Dr. Smith')).toBeTruthy();
    });

    it('handles logout flow', async () => {
        const { getByText } = render(<ProfileScreen />);
        fireEvent.press(getByText('Logout'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Logout',
            expect.any(String),
            expect.any(Array)
        );

        // Simulate pressing logout in the alert
        const logoutButton = (Alert.alert as jest.Mock).mock.calls[0][2][1];
        await act(async () => {
            await logoutButton.onPress();
        });

        expect(mockLogout).toHaveBeenCalled();
        expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });
});
