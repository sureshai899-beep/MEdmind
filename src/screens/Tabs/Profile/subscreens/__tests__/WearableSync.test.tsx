import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WearableSyncScreen } from '../WearableSync';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('WearableSyncScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders wearable sync options', () => {
        const { getByText, getAllByRole } = render(<WearableSyncScreen />);

        expect(getByText('Apple Watch')).toBeTruthy();
        expect(getByText('Galaxy Watch')).toBeTruthy();

        const switches = getAllByRole('switch');
        expect(switches.length).toBe(2);
    });

    it('updates switch values on toggle', () => {
        const { getAllByRole } = render(<WearableSyncScreen />);
        let switches = getAllByRole('switch');

        // Toggle Apple Watch (initially false)
        fireEvent(switches[0], 'onValueChange', true);

        switches = getAllByRole('switch');
        expect(switches[0].props.value).toBe(true);

        // Toggle Galaxy Watch (initially false)
        fireEvent(switches[1], 'onValueChange', true);

        switches = getAllByRole('switch');
        expect(switches[1].props.value).toBe(true);
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<WearableSyncScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
