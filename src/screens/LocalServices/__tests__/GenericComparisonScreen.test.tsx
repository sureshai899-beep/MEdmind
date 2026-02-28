import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GenericComparisonScreen } from '../GenericComparisonScreen';
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
jest.mock('../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('GenericComparisonScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders the screen title and default comparisons', () => {
        const { getByText, getByPlaceholderText } = render(<GenericComparisonScreen />);
        expect(getByText('Generic Savings')).toBeTruthy();
        expect(getByPlaceholderText('Search branded or generic drug...')).toBeTruthy();
        expect(getByText('Lipitor')).toBeTruthy();
        expect(getByText('Glucophage')).toBeTruthy();
    });

    it('filters items based on search input', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<GenericComparisonScreen />);

        const searchInput = getByPlaceholderText('Search branded or generic drug...');
        fireEvent.changeText(searchInput, 'Panadol');

        expect(getByText('Panadol')).toBeTruthy();
        expect(queryByText('Lipitor')).toBeNull();
        expect(queryByText('Glucophage')).toBeNull();
    });

    it('filters items based on generic name search', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<GenericComparisonScreen />);

        const searchInput = getByPlaceholderText('Search branded or generic drug...');
        fireEvent.changeText(searchInput, 'Metformin');

        expect(getByText('Glucophage')).toBeTruthy();
        expect(queryByText('Lipitor')).toBeNull();
    });

    it('navigates back when the back button is pressed', () => {
        const { getByTestId } = render(<GenericComparisonScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('displays savings information correctly', () => {
        const { getByText } = render(<GenericComparisonScreen />);
        // Lipitor savings is 64% as per COMPARISONS mock in file
        expect(getByText('64%')).toBeTruthy();
        expect(getByText(/Switching to the generic version can save you ₹800/)).toBeTruthy();
    });
});
