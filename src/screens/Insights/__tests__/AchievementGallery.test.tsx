import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AchievementGallery } from '../AchievementGallery';
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

describe('AchievementGallery', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders user level and XP', () => {
        const { getByText } = render(<AchievementGallery />);
        expect(getByText('Level 4')).toBeTruthy();
        expect(getByText('240 XP to Level 5')).toBeTruthy();
    });

    it('renders achievements list', () => {
        const { getByText } = render(<AchievementGallery />);
        expect(getByText('Early Bird')).toBeTruthy();
        expect(getByText('Perfect Week')).toBeTruthy();
        expect(getByText('Health Warrior')).toBeTruthy();
        expect(getByText('Streak Master')).toBeTruthy();
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<AchievementGallery />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
