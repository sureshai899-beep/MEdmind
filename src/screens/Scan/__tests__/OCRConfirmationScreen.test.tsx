import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { OCRConfirmationScreen } from '../OCRConfirmationScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMedications } from '../../../hooks/useMedications';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock components
jest.mock('../../../components/form/FormInput', () => {
    const { View, Text, TextInput } = require('react-native');
    return {
        FormInput: ({ label, value, onChangeText, placeholder }: any) => (
            <View>
                <Text>{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    testID={`input-${label}`}
                />
            </View>
        ),
    };
});

jest.mock('../../../components/ui/Button', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return {
        Button: ({ children, onPress, loading }: any) => (
            <TouchableOpacity onPress={onPress}>
                <Text>{children}</Text>
                {loading && <Text>Loading...</Text>}
            </TouchableOpacity>
        ),
    };
});

describe('OCRConfirmationScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };
    const mockAddMedication = jest.fn();
    const mockOcrData = {
        medicationName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        text: 'Lisinopril 10mg once daily prescription details...',
        confidence: 0.95,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useLocalSearchParams as jest.Mock).mockReturnValue({ data: JSON.stringify(mockOcrData) });
        (useMedications as jest.Mock).mockReturnValue({
            addMedication: mockAddMedication,
        });
    });

    it('renders initial data correctly', () => {
        const { getByDisplayValue, getByText } = render(<OCRConfirmationScreen />);

        expect(getByDisplayValue('Lisinopril')).toBeTruthy();
        expect(getByDisplayValue('10mg')).toBeTruthy();
        expect(getByDisplayValue('Once daily')).toBeTruthy();
        expect(getByText(new RegExp(mockOcrData.text))).toBeTruthy();
    });

    it('handles form edits', () => {
        const { getByDisplayValue, getByTestId } = render(<OCRConfirmationScreen />);

        const nameInput = getByTestId('input-Medication Name');
        fireEvent.changeText(nameInput, 'Amlodipine');

        expect(getByDisplayValue('Amlodipine')).toBeTruthy();
    });

    it('validates required fields', async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ data: JSON.stringify({ ...mockOcrData, medicationName: '' }) });
        const { getByText } = render(<OCRConfirmationScreen />);

        fireEvent.press(getByText('Confirm & Save'));

        expect(Alert.alert).toHaveBeenCalledWith('Missing Information', expect.any(String));
        expect(mockAddMedication).not.toHaveBeenCalled();
    });

    it('handles success path', async () => {
        mockAddMedication.mockResolvedValue({});
        const { getByText } = render(<OCRConfirmationScreen />);

        await act(async () => {
            fireEvent.press(getByText('Confirm & Save'));
        });

        expect(mockAddMedication).toHaveBeenCalledWith({
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            status: 'Active',
            schedule: 'Once daily',
        });
        expect(mockRouter.push).toHaveBeenCalledWith('/scan-success');
    });

    it('navigates back on "Try Scanning Again"', () => {
        const { getByText } = render(<OCRConfirmationScreen />);
        fireEvent.press(getByText('Try Scanning Again'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
