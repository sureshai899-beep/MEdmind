import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PremiumScreen } from '../PremiumScreen';
import { useRouter } from 'expo-router';
import { useProfile } from '../../../hooks/useProfile';
import { paymentService } from '../../../services/paymentService';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useProfile', () => ({
    useProfile: jest.fn(),
}));

// Mock services
jest.mock('../../../services/paymentService', () => ({
    paymentService: {
        processPayment: jest.fn(),
    },
    SUBSCRIPTION_PLANS: [
        { id: 'monthly', name: 'Monthly', price: '$9.99', description: 'Monthly plan' },
        { id: 'annual', name: 'Annual', price: '$99.99', description: 'Annual plan', isPopular: true },
    ],
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

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

describe('PremiumScreen', () => {
    const mockRouter = { back: jest.fn() };
    const mockSetPremiumStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useProfile as jest.Mock).mockReturnValue({
            setPremiumStatus: mockSetPremiumStatus,
            profile: {},
        });
    });

    it('renders all subscription plans', () => {
        const { getByText } = render(<PremiumScreen />);

        expect(getByText('Monthly')).toBeTruthy();
        expect(getByText('Annual')).toBeTruthy();
        expect(getByText('BEST VALUE')).toBeTruthy();
    });

    it('handles plan selection', () => {
        const { getByText, getByTestId } = render(<PremiumScreen />);

        const monthlyPlan = getByText('Monthly');
        fireEvent.press(monthlyPlan);

        // Check if selection checkmark appears (mocked icon)
        expect(getByTestId('icon-checkmark-circle')).toBeTruthy();
    });

    it('handles successful subscription', async () => {
        (paymentService.processPayment as jest.Mock).mockResolvedValue({ success: true });
        const { getByText } = render(<PremiumScreen />);

        fireEvent.press(getByText('Start My Premium Journey'));

        await waitFor(() => {
            expect(paymentService.processPayment).toHaveBeenCalled();
            expect(mockSetPremiumStatus).toHaveBeenCalledWith(true);
            expect(Alert.alert).toHaveBeenCalledWith('Welcome to Premium!', expect.any(String), expect.any(Array));
        });
    });

    it('handles payment failure', async () => {
        (paymentService.processPayment as jest.Mock).mockResolvedValue({ success: false, error: 'Card declined' });
        const { getByText } = render(<PremiumScreen />);

        fireEvent.press(getByText('Start My Premium Journey'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Payment Failed', 'Card declined');
        });
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<PremiumScreen />);
        fireEvent.press(getByTestId('icon-close').parent || getByTestId('icon-close'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
