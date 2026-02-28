import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DashboardScreen } from '../DashboardScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// Mock the components barrel so no real components pull in
// react-native-css-interop / SafeAreaView and crash with a displayName error
jest.mock('../../../../components', () => {
    const { View, Text } = require('react-native');
    const Stub = ({ children }: any) => <View>{children}</View>;
    return {
        DashboardHeader: () => <View testID="dashboard-header" />,
        TimeNavigator: () => <View testID="time-navigator" />,
        QuickInfoCard: () => <View testID="quick-info-card" />,
        AdherenceRing: () => <View testID="adherence-ring" />,
        MedicationCard: ({ medication }: any) => <View testID="medication-card"><Text>{medication?.name}</Text></View>,
        FloatingActionButton: ({ children, onPress }: any) => <View testID="fab" onTouchEnd={onPress}>{children}</View>,
        InsightBanner: () => <View testID="insight-banner" />,
        SkeletonMedicationCard: () => <View testID="skeleton" />,
        Icon: () => null,
        EmptyState: ({ title }: any) => <View testID="empty-state"><Text>{title}</Text></View>,
        Button: ({ children, onPress }: any) => <View onTouchEnd={onPress}><Text>{children}</Text></View>,
    };
});

// Mock profile sub-components separately
jest.mock('../../../../components/dashboard/MoodTrackerWidget', () => {
    const { View } = require('react-native');
    return { MoodTrackerWidget: () => <View testID="mood-tracker" /> };
});

jest.mock('../../../../components/profile/ProfileSwitcherSheet', () => {
    const { View } = require('react-native');
    return { ProfileSwitcherSheet: () => <View testID="profile-switcher" /> };
});

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

// Mock the hooks
jest.mock('../../../../hooks/useMedications', () => ({
    useMedications: () => ({
        medications: [
            {
                id: '1',
                name: 'Aspirin',
                dosage: '100mg',
                frequency: 'Once daily',
                schedule: 'Morning',
                status: 'Active',
                nextDoseTime: '08:00 AM',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
            },
        ],
        loading: false,
    }),
}));

jest.mock('../../../../hooks/useDoses', () => ({
    useDoses: () => ({
        calculateAdherence: jest.fn(() => 85),
        getTodayDoses: jest.fn(() => [
            {
                id: '1',
                medicationId: '1',
                medicationName: 'Aspirin',
                scheduledTime: '2024-01-01T08:00:00Z',
                status: 'pending',
                createdAt: '2024-01-01',
            },
        ]),
        logDose: jest.fn(),
    }),
}));

const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
};

jest.mock('../../../../hooks/useAuth', () => ({
    useAuth: () => ({
        user: mockUser,
    }),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
    Link: ({ children }: any) => children,
}));

describe('DashboardScreen Integration Tests', () => {
    it('renders dashboard structure', async () => {
        const { getByTestId } = render(<DashboardScreen />);

        await waitFor(() => {
            expect(getByTestId('dashboard-header')).toBeTruthy();
            expect(getByTestId('time-navigator')).toBeTruthy();
        });
    });

    it('displays medication cards from useMedications hook', async () => {
        const { getAllByTestId } = render(<DashboardScreen />);

        await waitFor(() => {
            expect(getAllByTestId('medication-card').length).toBeGreaterThan(0);
        });
    });

    it('shows dashboard key sections', async () => {
        const { getByTestId } = render(<DashboardScreen />);

        await waitFor(() => {
            expect(getByTestId('adherence-ring')).toBeTruthy();
            expect(getByTestId('insight-banner')).toBeTruthy();
        });
    });
});
