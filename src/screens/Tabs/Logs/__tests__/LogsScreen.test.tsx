import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LogsScreen } from '../LogsScreen';
import { useRouter } from 'expo-router';
import { useDoses } from '../../../../hooks/useDoses';
import { useAuth } from '../../../../hooks/useAuth';
import { historyExportService } from '../../../../services/historyExportService';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock expo-font
jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
}));

// Mock hooks
jest.mock('../../../../hooks/useDoses', () => ({
    useDoses: jest.fn(),
}));

jest.mock('../../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock services
jest.mock('../../../../services/historyExportService', () => ({
    historyExportService: {
        exportToPDF: jest.fn(),
        exportToCSV: jest.fn(),
    },
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('LogsScreen', () => {
    const mockRouter = { push: jest.fn() };
    const mockDoses = [
        {
            id: '1',
            medicationName: 'Aspirin',
            scheduledTime: '2024-01-01T10:00:00Z',
            status: 'taken',
            notes: 'Felt better',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({ user: { name: 'Test User' } });
    });

    it('renders empty state when no doses', () => {
        (useDoses as jest.Mock).mockReturnValue({
            doses: [],
            loading: false,
        });

        const { getByText } = render(<LogsScreen />);
        expect(getByText('No Logs Yet')).toBeTruthy();
    });

    it('renders list of doses', () => {
        (useDoses as jest.Mock).mockReturnValue({
            doses: mockDoses,
            loading: false,
        });

        const { getByText } = render(<LogsScreen />);
        expect(getByText('Aspirin')).toBeTruthy();
        expect(getByText('"Felt better"')).toBeTruthy();
        expect(getByText('taken')).toBeTruthy();
    });

    it('handles PDF export click', async () => {
        (useDoses as jest.Mock).mockReturnValue({
            doses: mockDoses,
            loading: false,
        });

        const { getByTestId } = render(<LogsScreen />);
        fireEvent.press(getByTestId('export-pdf-button'));

        expect(historyExportService.exportToPDF).toHaveBeenCalledWith(mockDoses, 'Test User');
    });

    it('handles CSV export click', async () => {
        (useDoses as jest.Mock).mockReturnValue({
            doses: mockDoses,
            loading: false,
        });

        const { getByTestId } = render(<LogsScreen />);
        fireEvent.press(getByTestId('export-csv-button'));

        expect(historyExportService.exportToCSV).toHaveBeenCalledWith(mockDoses);
    });

    it('shows alert when exporting with no doses', () => {
        (useDoses as jest.Mock).mockReturnValue({
            doses: [],
            loading: false,
        });

        const { getByTestId } = render(<LogsScreen />);
        fireEvent.press(getByTestId('export-pdf-button'));

        expect(Alert.alert).toHaveBeenCalledWith('No Data', expect.any(String));
        expect(historyExportService.exportToPDF).not.toHaveBeenCalled();
    });
});
