import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { MedicationDetailScreen } from '../MedicationDetailScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMedications } from '../../../hooks/useMedications';
import { drugSafetyService } from '../../../services/drugSafetyService';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useLocalSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

// Mock useMedications
jest.mock('../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock drugSafetyService
jest.mock('../../../services/drugSafetyService', () => ({
    drugSafetyService: {
        checkInteractions: jest.fn(),
    },
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components', () => {
    const { View, Text, TouchableOpacity, Image } = require('react-native');
    return {
        DrugDetailHeader: ({ name, dosage, onBack }: any) => (
            <View>
                <TouchableOpacity onPress={onBack} testID="back-button">
                    <Text>Back</Text>
                </TouchableOpacity>
                <Text>{name}</Text>
                <Text>{dosage}</Text>
            </View>
        ),
        AIPoweredSummaryCard: ({ title, summary }: any) => (
            <View>
                <Text>{title}</Text>
                <Text>{summary}</Text>
            </View>
        ),
        Button: ({ children, onPress, testID }: any) => (
            <TouchableOpacity onPress={onPress} testID={testID}>
                <Text>{children}</Text>
            </TouchableOpacity>
        ),
        Icon: ({ name, color, testID }: any) => <View testID={testID || `icon-${name}`} />,
    };
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

describe('MedicationDetailScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };
    const mockGetMedicationById = jest.fn();
    const mockUpdateMedication = jest.fn();
    const mockMedication = {
        id: 'm1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        purpose: 'Blood Pressure',
        schedule: '08:00',
        status: 'Active',
        sideEffects: ['Cough', 'Dizziness'],
        storageInstructions: 'Dry place',
        contraindications: ['Pregnancy'],
        pillImageUri: 'existing-uri',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'm1' });
        (useMedications as jest.Mock).mockReturnValue({
            medications: [mockMedication],
            getMedicationById: mockGetMedicationById,
            updateMedication: mockUpdateMedication,
        });
        mockGetMedicationById.mockReturnValue(mockMedication);
        (drugSafetyService.checkInteractions as jest.Mock).mockResolvedValue([]);
    });

    it('renders medication details correctly', async () => {
        const { getAllByText, getByText } = render(<MedicationDetailScreen />);

        await waitFor(() => {
            expect(getAllByText('Lisinopril').length).toBeGreaterThan(0);
            expect(getAllByText('10mg').length).toBeGreaterThan(0);
            expect(getByText('Once daily')).toBeTruthy();
            expect(getAllByText(/Blood Pressure/).length).toBeGreaterThan(0);
            expect(getByText('Cough')).toBeTruthy();
            expect(getByText(/Pregnancy/)).toBeTruthy();
        });
    });

    it('handles NewScannedMed special case', async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'NewScannedMed' });
        const { getByText } = render(<MedicationDetailScreen />);

        await waitFor(() => {
            expect(getByText('Lisinopril (Scanned)')).toBeTruthy();
        });
    });

    it('shows interaction warnings', async () => {
        const mockInteraction = {
            id: 'i1',
            severity: 'High',
            description: 'Severe interaction with Grapefruit',
            affectedDrugs: ['Lisinopril', 'Grapefruit'],
        };
        (drugSafetyService.checkInteractions as jest.Mock).mockResolvedValue([mockInteraction]);

        const { getByText } = render(<MedicationDetailScreen />);

        await waitFor(() => {
            expect(getByText('High Interaction Warning')).toBeTruthy();
            expect(getByText('Severe interaction with Grapefruit')).toBeTruthy();
        });
    });

    it('handles image picking and updates medication', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'new-image-uri' }],
        });

        const { getByTestId } = render(<MedicationDetailScreen />);

        await act(async () => {
            fireEvent.press(getByTestId('pill-image-container'));
        });

        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        await waitFor(() => {
            expect(mockUpdateMedication).toHaveBeenCalledWith('m1', { pillImageUri: 'new-image-uri' });
        });
    });

    it('navigates back on header back press', async () => {
        const { getByTestId } = render(<MedicationDetailScreen />);
        fireEvent.press(getByTestId('back-button'));
        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('navigates to edit form', async () => {
        const { getByText } = render(<MedicationDetailScreen />);
        fireEvent.press(getByText('Edit Medication'));
        expect(mockRouter.push).toHaveBeenCalledWith({
            pathname: '/medication/form',
            params: { mode: 'edit', id: 'm1' },
        });
    });
});
