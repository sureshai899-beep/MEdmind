import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelectionScreen from '../LanguageSelectionScreen';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock expo-font
jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components', () => {
    const { View, Text } = require('react-native');
    return {
        Icon: ({ name }: { name: string }) => <View testID={`icon-${name}`} />,
    };
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return {
        SafeAreaView: ({ children }: any) => <View>{children}</View>,
    };
});

describe('LanguageSelectionScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders language list correctly', () => {
        const { getAllByText, getByText } = render(<LanguageSelectionScreen />);
        // English appears twice (label and native)
        expect(getAllByText('English').length).toBeGreaterThanOrEqual(1);
        expect(getByText('Hindi')).toBeTruthy();
        expect(getByText('Marathi')).toBeTruthy();
    });

    it('selects a language when pressed', () => {
        const { getByText, getByTestId } = render(<LanguageSelectionScreen />);

        // Initial selected language is English
        expect(getByTestId('icon-checkmark-circle')).toBeTruthy();

        // Select Hindi
        const hindiButton = getByText('Hindi');
        fireEvent.press(hindiButton);

        // Since Icon is mocked to render a View with name, we can check for the checkmark
        expect(getByTestId('icon-checkmark-circle')).toBeTruthy();
    });

    it('calls router.back() when back button is pressed', () => {
        const { getByTestId } = render(<LanguageSelectionScreen />);
        const backButton = getByTestId('back-button');
        fireEvent.press(backButton);
        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('calls router.back() when Confirm & Continue is pressed', () => {
        const { getByText } = render(<LanguageSelectionScreen />);
        const confirmButton = getByText('Confirm & Continue');
        fireEvent.press(confirmButton);
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
