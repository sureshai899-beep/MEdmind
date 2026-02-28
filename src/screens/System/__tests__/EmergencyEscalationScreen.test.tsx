import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmergencyEscalationScreen } from '../EmergencyEscalationScreen';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock Linking
jest.spyOn(Linking, 'openURL');

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

describe('EmergencyEscalationScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders emergency alert and med name', () => {
        const { getByText } = render(<EmergencyEscalationScreen />);
        expect(getByText('Critical Missed Doses')).toBeTruthy();
        expect(getByText('Warfarin')).toBeTruthy();
    });

    it('renders caregiver information', () => {
        const { getByText } = render(<EmergencyEscalationScreen />);
        expect(getByText('Dr. Sarah Wilson')).toBeTruthy();
        expect(getByText('Primary Caregiver')).toBeTruthy();
    });

    it('handles caregiver call button', () => {
        const { getByText } = render(<EmergencyEscalationScreen />);
        fireEvent.press(getByText('Dial Caregiver'));
        expect(Linking.openURL).toHaveBeenCalledWith('tel:911'); // Placeholder used in code
    });

    it('handles emergency services button', () => {
        const { getByText } = render(<EmergencyEscalationScreen />);
        fireEvent.press(getByText('Call Emergency Services (911)'));
        expect(Linking.openURL).toHaveBeenCalledWith('tel:911');
    });

    it('handles back navigation', () => {
        const { getByTestId } = render(<EmergencyEscalationScreen />);
        fireEvent.press(getByTestId('icon-close').parent || getByTestId('icon-close'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
