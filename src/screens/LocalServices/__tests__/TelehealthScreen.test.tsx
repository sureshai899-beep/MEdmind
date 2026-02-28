import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TelehealthScreen } from '../TelehealthScreen';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
    openBrowserAsync: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('TelehealthScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders the screen title and partner list', () => {
        const { getByText } = render(<TelehealthScreen />);
        expect(getByText('Telehealth Portal')).toBeTruthy();
        expect(getByText('Practo')).toBeTruthy();
        expect(getByText('Tata 1mg')).toBeTruthy();
        expect(getByText('Apollo 24|7')).toBeTruthy();
    });

    it('opens the correct URL when a partner is pressed', async () => {
        const { getByText } = render(<TelehealthScreen />);
        fireEvent.press(getByText('Practo'));
        expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith('https://www.practo.com/consult');
    });

    it('navigates back when the back button is pressed', () => {
        const { getByTestId } = render(<TelehealthScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('renders the disclaimer notice', () => {
        const { getByText } = render(<TelehealthScreen />);
        expect(getByText('Notice')).toBeTruthy();
        expect(getByText(/Pillara is an aggregator for telehealth services/)).toBeTruthy();
    });
});
