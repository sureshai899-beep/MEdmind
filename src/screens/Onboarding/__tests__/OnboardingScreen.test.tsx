import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { OnboardingScreen } from '../OnboardingScreen';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { usePrivacy } from '../../../hooks/usePrivacy';
import { useCameraPermissions } from 'expo-camera';
import { notificationService } from '../../../services/notificationService';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../../hooks/useProfile', () => ({
    useProfile: jest.fn(),
}));

jest.mock('../../../hooks/usePrivacy', () => ({
    usePrivacy: jest.fn(),
}));

jest.mock('expo-camera', () => ({
    useCameraPermissions: jest.fn(),
}));

jest.mock('../../../services/notificationService', () => ({
    notificationService: {
        requestPermissions: jest.fn(),
    },
}));

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
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

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        OnboardingStepper: () => <View testID="stepper" />,
        ProfileSetupForm: ({ onComplete }: any) => (
            <View testID="profile-form">
                <TouchableOpacity onPress={() => onComplete({ name: 'Test User', age: 25 })} testID="submit-profile">
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        ),
        Icon: () => null,
        Button: ({ children, onPress, loading }: any) => (
            <TouchableOpacity onPress={onPress} disabled={loading} testID="next-button">
                <Text>{children}</Text>
            </TouchableOpacity>
        ),
    };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('OnboardingScreen', () => {
    const mockRouter = { push: jest.fn(), replace: jest.fn() };
    const mockSetHasOnboarded = jest.fn();
    const mockUpdateUser = jest.fn();
    const mockUpdateConsent = jest.fn();
    const mockUpdatePersonalInfo = jest.fn();
    const mockToggleBiometric = jest.fn();
    const mockRequestCameraPermission = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({
            setHasOnboarded: mockSetHasOnboarded,
            updateUser: mockUpdateUser,
            isAuthenticated: true,
        });
        (useProfile as jest.Mock).mockReturnValue({
            updateConsent: mockUpdateConsent,
            updatePersonalInfo: mockUpdatePersonalInfo,
        });
        (usePrivacy as jest.Mock).mockReturnValue({
            toggleBiometric: mockToggleBiometric,
            isBiometricSupported: true,
        });
        (useCameraPermissions as jest.Mock).mockReturnValue([
            { status: 'undetermined', granted: false },
            mockRequestCameraPermission,
        ]);

        // Provide default successful resolved values for async mocks
        mockUpdateConsent.mockResolvedValue({});
        mockUpdatePersonalInfo.mockResolvedValue({});
        mockUpdateUser.mockResolvedValue({});
        mockSetHasOnboarded.mockResolvedValue({});
        mockToggleBiometric.mockResolvedValue(true);
        mockRequestCameraPermission.mockResolvedValue({ status: 'granted' });
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (notificationService.requestPermissions as jest.Mock).mockResolvedValue(true);
    });

    const navigateToSlide = async (targetText: string, getByText: any, getByTestId: any) => {
        const slides = ['Smart OCR Scanning', 'Safety First', 'Circle of Trust', 'Your Data, Secured', 'Enable Permissions', 'Secure Access', 'Finalize Profile'];
        for (const title of slides) {
            if (title === targetText) break;

            if (title === 'Your Data, Secured') {
                fireEvent.press(getByText('I understand and consent to local data storage for my medical information.'));
            }

            fireEvent.press(getByTestId('next-button'));

            const nextTitle = slides[slides.indexOf(title) + 1];
            await waitFor(() => {
                if (nextTitle === 'Finalize Profile') {
                    expect(getByTestId('profile-form')).toBeTruthy();
                } else {
                    expect(getByText(nextTitle)).toBeTruthy();
                }
            });
        }
    };

    it('renders initial slide correctly', () => {
        const { getByText, getByTestId } = render(<OnboardingScreen />);
        expect(getByText('Smart OCR Scanning')).toBeTruthy();
        expect(getByTestId('stepper')).toBeTruthy();
    });

    it('navigates through value prop slides', async () => {
        const { getByText, getByTestId } = render(<OnboardingScreen />);

        // Slide 1 -> Slide 2
        fireEvent.press(getByTestId('next-button'));
        await waitFor(() => expect(getByText('Safety First')).toBeTruthy());

        // Slide 2 -> Slide 3
        fireEvent.press(getByTestId('next-button'));
        await waitFor(() => expect(getByText('Circle of Trust')).toBeTruthy());

        // Slide 3 -> Slide 4 (Consent)
        fireEvent.press(getByTestId('next-button'));
        await waitFor(() => expect(getByText('Your Data, Secured')).toBeTruthy());
    });

    it('requires consent on the consent slide', async () => {
        const { getByTestId, getByText } = render(<OnboardingScreen />);

        await navigateToSlide('Your Data, Secured', getByText, getByTestId);

        // Press next without consent
        fireEvent.press(getByTestId('next-button'));
        expect(Alert.alert).toHaveBeenCalledWith("Consent Required", expect.any(String));

        // Toggle consent
        fireEvent.press(getByText('I understand and consent to local data storage for my medical information.'));
        fireEvent.press(getByTestId('next-button'));

        await waitFor(() => {
            expect(mockUpdateConsent).toHaveBeenCalledWith({ dataStorage: true });
            expect(getByText('Enable Permissions')).toBeTruthy();
        });
    });

    it('requests all permissions on the permissions slide', async () => {
        const { getByTestId, getByText } = render(<OnboardingScreen />);

        await navigateToSlide('Enable Permissions', getByText, getByTestId);

        fireEvent.press(getByTestId('next-button'));

        await waitFor(() => {
            expect(mockRequestCameraPermission).toHaveBeenCalled();
            expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
            expect(notificationService.requestPermissions).toHaveBeenCalled();
            expect(getByText('Secure Access')).toBeTruthy();
        });
    });

    it('handles biometric setup on the privacy slide', async () => {
        mockToggleBiometric.mockResolvedValue(true);
        const { getByTestId, getByText } = render(<OnboardingScreen />);

        await navigateToSlide('Secure Access', getByText, getByTestId);

        fireEvent.press(getByTestId('next-button'));

        await waitFor(() => {
            expect(mockToggleBiometric).toHaveBeenCalledWith(true);
            expect(getByTestId('profile-form')).toBeTruthy();
        });
    });

    it('handles biometric failure/skip gracefully', async () => {
        mockToggleBiometric.mockResolvedValue(false);
        const { getByTestId, getByText } = render(<OnboardingScreen />);

        await navigateToSlide('Secure Access', getByText, getByTestId);

        fireEvent.press(getByTestId('next-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Security", expect.any(String), expect.any(Array));
        });

        // Simulate pressing "Continue" on alert
        const continueButton = (Alert.alert as jest.Mock).mock.calls[0][2][0];
        act(() => {
            continueButton.onPress();
        });

        await waitFor(() => expect(getByTestId('profile-form')).toBeTruthy());
    });

    it('completes onboarding and navigates to tabs', async () => {
        mockUpdatePersonalInfo.mockResolvedValue({});
        mockUpdateUser.mockResolvedValue({});
        mockSetHasOnboarded.mockResolvedValue({});

        const { getByTestId, getByText } = render(<OnboardingScreen />);

        await navigateToSlide('Finalize Profile', getByText, getByTestId);

        await waitFor(() => expect(getByTestId('profile-form')).toBeTruthy());

        fireEvent.press(getByTestId('submit-profile'));

        await waitFor(() => {
            expect(mockUpdatePersonalInfo).toHaveBeenCalledWith({
                name: 'Test User',
                age: 25,
                profilePictureUrl: undefined,
            });
            expect(mockUpdateUser).toHaveBeenCalledWith({ name: 'Test User', profilePictureUrl: undefined });
            expect(mockSetHasOnboarded).toHaveBeenCalledWith(true);
            expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
        });
    });
});
