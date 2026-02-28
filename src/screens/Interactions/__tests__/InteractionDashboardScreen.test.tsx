import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { InteractionDashboardScreen } from '../InteractionDashboardScreen';
import { useRouter } from 'expo-router';
import { useMedications } from '../../../hooks/useMedications';
import { drugSafetyService } from '../../../services/drugSafetyService';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock drugSafetyService
jest.mock('../../../services/drugSafetyService', () => ({
    drugSafetyService: {
        checkInteractions: jest.fn(),
    },
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
        Icon: ({ name, testID }: any) => <View testID={testID || `icon-${name}`} />,
    };
});

describe('InteractionDashboardScreen', () => {
    const mockRouter = { back: jest.fn() };
    const mockMedications = [
        { id: '1', name: 'Drug A' },
        { id: '2', name: 'Drug B' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useMedications as jest.Mock).mockReturnValue({
            medications: mockMedications,
            loading: false,
        });
        (drugSafetyService.checkInteractions as jest.Mock).mockResolvedValue([]);
    });

    it('renders loading state initially', () => {
        (useMedications as jest.Mock).mockReturnValue({
            medications: [],
            loading: true,
        });
        const { getByText } = render(<InteractionDashboardScreen />);
        expect(getByText('Checking for interactions...')).toBeTruthy();
    });

    it('renders empty state when no interactions are found', async () => {
        const { getByText } = render(<InteractionDashboardScreen />);

        await waitFor(() => {
            expect(getByText('No interactions detected!')).toBeTruthy();
            expect(getByText(/analyzed your 2 active medications/)).toBeTruthy();
        });
    });

    it('renders high, moderate, and minor interactions', async () => {
        const mockInteractions = [
            { id: 'i1', severity: 'High', description: 'Severe danger', affectedDrugs: ['Drug A', 'Drug B'] },
            { id: 'i2', severity: 'Moderate', description: 'Some risk', affectedDrugs: ['Drug A', 'Drug C'] },
            { id: 'i3', severity: 'Minor', description: 'Low risk', affectedDrugs: ['Drug B', 'Drug D'] },
        ];
        (drugSafetyService.checkInteractions as jest.Mock).mockResolvedValue(mockInteractions);

        const { getByText } = render(<InteractionDashboardScreen />);

        await waitFor(() => {
            expect(getByText('High Severity')).toBeTruthy();
            expect(getByText('Moderate Severity')).toBeTruthy();
            expect(getByText('Minor Severity')).toBeTruthy();
            expect(getByText('Severe danger')).toBeTruthy();
            expect(getByText('Some risk')).toBeTruthy();
            expect(getByText('Low risk')).toBeTruthy();
            expect(getByText('3 potential interactions found.')).toBeTruthy();
        });
    });

    it('renders drug chips for each interaction', async () => {
        const mockInteractions = [
            { id: 'i1', severity: 'High', description: 'Severe danger', affectedDrugs: ['Drug A', 'Drug B'] },
        ];
        (drugSafetyService.checkInteractions as jest.Mock).mockResolvedValue(mockInteractions);

        const { getByText } = render(<InteractionDashboardScreen />);

        await waitFor(() => {
            expect(getByText('Drug A')).toBeTruthy();
            expect(getByText('Drug B')).toBeTruthy();
        });
    });

    it('handles back button navigation', async () => {
        const { getByTestId } = render(<InteractionDashboardScreen />);

        await waitFor(() => {
            fireEvent.press(getByTestId('interaction-back-button'));
        });

        expect(mockRouter.back).toHaveBeenCalled();
    });
});
