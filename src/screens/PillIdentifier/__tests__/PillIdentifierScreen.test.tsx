import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PillIdentifierScreen from '../PillIdentifierScreen';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock components
jest.mock('../../../components', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

describe('PillIdentifierScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders initial state and does not navigate if button is pressed while disabled', () => {
        const { getByTestId, getByText } = render(<PillIdentifierScreen />);

        expect(getByText('Pill Identifier')).toBeTruthy();
        const button = getByTestId('identify-button');

        // Press while disabled (initial state)
        fireEvent.press(button);
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('enables button and navigates after selection', () => {
        const { getByTestId, getByText } = render(<PillIdentifierScreen />);

        fireEvent.press(getByText('White'));
        fireEvent.press(getByText('Round'));

        const button = getByTestId('identify-button');
        fireEvent.press(button);

        expect(mockRouter.push).toHaveBeenCalledWith('/medication/1');
    });

    it('handles identification logic with different selections', () => {
        const { getByTestId, getByText } = render(<PillIdentifierScreen />);

        fireEvent.press(getByText('Blue'));
        fireEvent.press(getByText('Capsule'));

        const button = getByTestId('identify-button');
        fireEvent.press(button);

        expect(mockRouter.push).toHaveBeenCalledWith('/medication/1');
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<PillIdentifierScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
