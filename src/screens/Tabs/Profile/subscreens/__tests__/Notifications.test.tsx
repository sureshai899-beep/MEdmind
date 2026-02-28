import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NotificationsScreen } from '../Notifications';
import { useRouter } from 'expo-router';
import { notificationService } from '../../../../../services/notificationService';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock services
jest.mock('../../../../../services/notificationService', () => ({
    notificationService: {
        testNotification: jest.fn(),
    },
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

describe('NotificationsScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders all notification switches', () => {
        const { getByText, getAllByRole } = render(<NotificationsScreen />);

        expect(getByText('Medication Reminders')).toBeTruthy();
        expect(getByText('Refill Alerts')).toBeTruthy();
        expect(getByText('Weekly Health Summary')).toBeTruthy();
        expect(getByText('App News & Updates')).toBeTruthy();

        const switches = getAllByRole('switch');
        expect(switches.length).toBe(4);
    });

    it('updates switch values on toggle', () => {
        const { getAllByRole } = render(<NotificationsScreen />);
        let switches = getAllByRole('switch');

        // Toggle Medication Reminders (initially true)
        fireEvent(switches[0], 'onValueChange', false);

        // Re-query to avoid "unmounted component" error
        switches = getAllByRole('switch');
        expect(switches[0].props.value).toBe(false);

        // Toggle App News & Updates (initially false)
        fireEvent(switches[3], 'onValueChange', true);

        switches = getAllByRole('switch');
        expect(switches[3].props.value).toBe(true);
    });

    it('handles test notification trigger', async () => {
        const { getByText } = render(<NotificationsScreen />);

        fireEvent.press(getByText('Send Test Notification'));

        expect(notificationService.testNotification).toHaveBeenCalled();
    });

    it('handles back button navigation', () => {
        const { getByText } = render(<NotificationsScreen />);
        fireEvent.press(getByText('← Back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
