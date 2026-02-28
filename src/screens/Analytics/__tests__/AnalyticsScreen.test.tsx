import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AnalyticsScreen } from '../AnalyticsScreen';
import { useRouter } from 'expo-router';
import { useDoses } from '../../../hooks/useDoses';
import { useMedications } from '../../../hooks/useMedications';
import { historyExportService } from '../../../services/historyExportService';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useDoses', () => ({
    useDoses: jest.fn(),
}));

jest.mock('../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock services
jest.mock('../../../services/historyExportService', () => ({
    historyExportService: {
        exportToPDF: jest.fn(),
        exportToCSV: jest.fn(),
    },
}));

// Mock components
jest.mock('../../../components', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        AdherenceChart: () => <View testID="adherence-chart" />,
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
        ReportGenerationModal: ({ visible, onGenerate }: any) =>
            visible ? (
                <View testID="report-modal">
                    <TouchableOpacity onPress={() => onGenerate({ format: 'pdf', startDate: '2026-01-01', endDate: '2026-01-31' })} testID="generate-pdf">
                        <Text>Generate PDF</Text>
                    </TouchableOpacity>
                </View>
            ) : null,
    };
});

jest.mock('../../../components/chart/CalendarHeatmap', () => {
    const { View } = require('react-native');
    return {
        CalendarHeatmap: () => <View testID="calendar-heatmap" />,
    };
});

jest.mock('../../../components/analytics', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        QuickStats: ({ adherence, streak, taken, missed }: any) => (
            <View>
                <Text>Adherence: {adherence}%</Text>
                <Text>Streak: {streak}</Text>
                <Text>Taken: {taken}</Text>
                <Text>Missed: {missed}</Text>
            </View>
        ),
        MedicationBreakdown: ({ data }: any) => (
            <View>
                {data.map((item: any) => (
                    <Text key={item.name}>{item.name}: {item.adherence}%</Text>
                ))}
            </View>
        ),
        PeriodSelector: ({ selectedPeriod, onPeriodChange }: any) => (
            <TouchableOpacity onPress={() => onPeriodChange('7')} testID="change-period">
                <Text>Period: {selectedPeriod}</Text>
            </TouchableOpacity>
        ),
    };
});

describe('AnalyticsScreen', () => {
    const mockRouter = { back: jest.fn() };
    const mockMedications = [{ id: '1', name: 'Med A' }];
    const mockDoseHistory = [
        { medicationId: '1', status: 'taken', scheduledTime: new Date().toISOString() },
        { medicationId: '1', status: 'missed', scheduledTime: new Date(Date.now() - 86400000).toISOString() },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useDoses as jest.Mock).mockReturnValue({
            calculateAdherence: jest.fn().mockReturnValue(85),
            getDoseHistory: jest.fn().mockReturnValue(mockDoseHistory),
        });
        (useMedications as jest.Mock).mockReturnValue({
            medications: mockMedications,
        });
    });

    it('renders analytics data correctly', () => {
        const { getByText, getByTestId } = render(<AnalyticsScreen />);

        expect(getByText('Adherence: 85%')).toBeTruthy();
        expect(getByText('Taken: 1')).toBeTruthy();
        expect(getByText('Missed: 1')).toBeTruthy();
        expect(getByText('Med A: 50%')).toBeTruthy();
        expect(getByTestId('adherence-chart')).toBeTruthy();
        expect(getByTestId('calendar-heatmap')).toBeTruthy();
    });

    it('handles period change', () => {
        const { getByTestId, getByText } = render(<AnalyticsScreen />);
        fireEvent.press(getByTestId('change-period'));
        expect(getByText('Period: 7')).toBeTruthy();
    });

    it('opens export modal and generates report', () => {
        const { getByTestId, getByText } = render(<AnalyticsScreen />);

        // Open modal via share icon
        fireEvent.press(getByTestId('icon-share').parent || getByTestId('icon-share'));

        expect(getByTestId('report-modal')).toBeTruthy();

        fireEvent.press(getByText('Generate PDF'));
        expect(historyExportService.exportToPDF).toHaveBeenCalled();
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<AnalyticsScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
