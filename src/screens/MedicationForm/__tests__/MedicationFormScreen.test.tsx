import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { MedicationFormScreen } from "../MedicationFormScreen";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMedications } from "../../../hooks/useMedications";
import { Alert, View, Text, TextInput, TouchableOpacity } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

// Mock useMedications hook
jest.mock('../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock components
jest.mock('../../../components/form/FormInput', () => {
    const { View, Text, TextInput } = require('react-native');
    return {
        FormInput: ({ label, value, onChangeText, testID, error }: any) => (
            <View>
                <Text>{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    testID={testID}
                />
                {error && <Text testID="input-error">{error}</Text>}
            </View>
        ),
    };
});

jest.mock('../../../components/ui/Button', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return {
        Button: ({ children, onPress, testID, loading, disabled }: any) => (
            <TouchableOpacity
                onPress={onPress}
                testID={testID}
                disabled={disabled || loading}
            >
                <Text>{children}</Text>
            </TouchableOpacity>
        ),
    };
});

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('MedicationFormScreen', () => {
    const mockRouter = { back: jest.fn() };
    const mockAddMedication = jest.fn();
    const mockUpdateMedication = jest.fn();
    const mockGetMedicationById = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useLocalSearchParams as jest.Mock).mockReturnValue({});
        (useMedications as jest.Mock).mockReturnValue({
            addMedication: mockAddMedication,
            updateMedication: mockUpdateMedication,
            getMedicationById: mockGetMedicationById,
        });

        mockAddMedication.mockResolvedValue({ id: 'new-id' });
        mockUpdateMedication.mockResolvedValue({});
    });

    it('renders in Add mode by default', () => {
        const { getByText } = render(<MedicationFormScreen />);
        expect(getByText('Add Medication')).toBeTruthy();
        expect(getByText('Save Medication')).toBeTruthy();
    });

    it('renders in Edit mode and pre-fills data', () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ mode: 'edit', id: 'm1' });
        mockGetMedicationById.mockReturnValue({
            id: 'm1',
            name: 'Advil',
            dosage: '200mg',
            frequency: 'As needed',
            purpose: 'Pain',
        });

        const { getByText, getByDisplayValue } = render(<MedicationFormScreen />);

        expect(getByText('Edit Medication')).toBeTruthy();
        expect(getByDisplayValue('Advil')).toBeTruthy();
        expect(getByDisplayValue('200mg')).toBeTruthy();
    });

    it('shows validation errors when validation fails (empty fields)', async () => {
        const { getByTestId, getAllByTestId } = render(<MedicationFormScreen />);

        await act(async () => {
            fireEvent.press(getByTestId('save-button'));
        });

        await waitFor(() => {
            // MedicationSchema requires name, dosage, frequency
            const errors = getAllByTestId('input-error');
            expect(errors.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('successfully adds a medication', async () => {
        const { getByTestId } = render(<MedicationFormScreen />);

        fireEvent.changeText(getByTestId('input-medication-name'), 'Tylenol');
        fireEvent.changeText(getByTestId('input-dosage'), '500mg');
        fireEvent.changeText(getByTestId('input-frequency'), 'Every 6 hours');

        await act(async () => {
            fireEvent.press(getByTestId('save-button'));
        });

        await waitFor(() => {
            expect(mockAddMedication).toHaveBeenCalledWith({
                name: 'Tylenol',
                dosage: '500mg',
                frequency: 'Every 6 hours',
                purpose: '',
                schedule: 'Every 6 hours',
                status: 'Active',
            });
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Medication added successfully');
            expect(mockRouter.back).toHaveBeenCalled();
        });
    });

    it('successfully updates a medication', async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ mode: 'edit', id: 'm1' });
        mockGetMedicationById.mockReturnValue({
            id: 'm1',
            name: 'Advil',
            dosage: '200mg',
            frequency: 'As needed',
        });

        const { getByTestId } = render(<MedicationFormScreen />);

        fireEvent.changeText(getByTestId('input-medication-name'), 'Advil Liquid Gels');

        await act(async () => {
            fireEvent.press(getByTestId('save-button'));
        });

        await waitFor(() => {
            expect(mockUpdateMedication).toHaveBeenCalledWith('m1', {
                name: 'Advil Liquid Gels',
                dosage: '200mg',
                frequency: 'As needed',
                purpose: '',
            });
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Medication updated successfully');
            expect(mockRouter.back).toHaveBeenCalled();
        });
    });

    it('handles save error gracefully', async () => {
        mockAddMedication.mockRejectedValue(new Error('Save failed'));
        const { getByTestId } = render(<MedicationFormScreen />);

        // Fill required fields to pass validation
        fireEvent.changeText(getByTestId('input-medication-name'), 'Tylenol');
        fireEvent.changeText(getByTestId('input-dosage'), '500mg');
        fireEvent.changeText(getByTestId('input-frequency'), 'Every 6 hours');

        await act(async () => {
            fireEvent.press(getByTestId('save-button'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to save medication. Please try again.');
        });
    });
});
