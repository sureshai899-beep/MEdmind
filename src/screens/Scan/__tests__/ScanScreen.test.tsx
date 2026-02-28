import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ScanScreen } from '../ScanScreen';
import { useRouter } from 'expo-router';
import { useCamera } from '../../../hooks/useCamera';
import { useMedications } from '../../../hooks/useMedications';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useCamera', () => ({
    useCamera: jest.fn(),
}));

jest.mock('../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock components
jest.mock('../../../components', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        ScanProgress: ({ progress, statusText }: any) => (
            <View>
                <Text>Progress: {progress}%</Text>
                <Text>{statusText}</Text>
            </View>
        ),
        ScanInstructionBox: ({ instruction }: any) => <Text>{instruction}</Text>,
        ScanActionCard: ({ onTakePhoto, onChooseLibrary }: any) => (
            <View>
                <TouchableOpacity onPress={onTakePhoto} testID="take-photo">
                    <Text>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onChooseLibrary} testID="choose-library">
                    <Text>Choose Library</Text>
                </TouchableOpacity>
            </View>
        ),
        Button: ({ children, onPress }: any) => (
            <TouchableOpacity onPress={onPress}>
                <Text>{children}</Text>
            </TouchableOpacity>
        ),
        Icon: () => null,
        OCRResultModal: ({ visible, onSave }: any) =>
            visible ? (
                <TouchableOpacity onPress={() => onSave({ medicationName: 'Test Med', dosage: '10mg', frequency: 'Daily' })} testID="save-ocr">
                    <Text>Save OCR</Text>
                </TouchableOpacity>
            ) : null,
    };
});

jest.mock('../../../components/camera/CustomCameraView', () => {
    const { View, TouchableOpacity, Text } = require('react-native');
    return {
        CustomCameraView: ({ visible, onCapture }: any) =>
            visible ? (
                <TouchableOpacity onPress={() => onCapture({ uri: 'cam-uri', type: 'image' })} testID="cam-capture">
                    <Text>Capture</Text>
                </TouchableOpacity>
            ) : null,
    };
});

describe('ScanScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };
    const mockPickImage = jest.fn();
    const mockProcessImageForOCR = jest.fn();
    const mockAddMedication = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useCamera as jest.Mock).mockReturnValue({
            pickImage: mockPickImage,
            processImageForOCR: mockProcessImageForOCR,
            loading: false,
            error: null,
        });
        (useMedications as jest.Mock).mockReturnValue({
            addMedication: mockAddMedication,
        });
    });

    it('renders instruction and action cards', () => {
        const { getByText } = render(<ScanScreen />);
        expect(getByText(/Scan your medication bottle/)).toBeTruthy();
        expect(getByText('Take Photo')).toBeTruthy();
        expect(getByText('Choose Library')).toBeTruthy();
    });

    it('handles manual entry navigation', () => {
        const { getByText } = render(<ScanScreen />);
        fireEvent.press(getByText('Manual Entry'));
        expect(mockRouter.push).toHaveBeenCalledWith({
            pathname: '/medication/form',
            params: { mode: 'add' },
        });
    });

    it('shows scanning progress', async () => {
        mockProcessImageForOCR.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({}), 100)));
        mockPickImage.mockResolvedValue({ uri: 'test-uri' });

        const { getByTestId, getByText } = render(<ScanScreen />);

        await act(async () => {
            fireEvent.press(getByTestId('choose-library'));
        });

        expect(getByText('Progress: 30%')).toBeTruthy();
        expect(getByText('Analyzing prescription label...')).toBeTruthy();
    });

    it('handles camera capture and OCR', async () => {
        const mockOcrResult = { medicationName: 'Result', dosage: '5mg' };
        mockProcessImageForOCR.mockResolvedValue(mockOcrResult);

        const { getByTestId, getByText } = render(<ScanScreen />);

        // Open camera
        fireEvent.press(getByTestId('take-photo'));

        // Capture image
        await act(async () => {
            fireEvent.press(getByTestId('cam-capture'));
        });

        expect(mockProcessImageForOCR).toHaveBeenCalledWith('cam-uri');

        // Check if modal opens (mockSave is in the modal)
        await waitFor(() => {
            expect(getByTestId('save-ocr')).toBeTruthy();
        });
    });

    it('handles saving OCR result', async () => {
        const mockOcrResult = { medicationName: 'Result', dosage: '5mg' };
        mockProcessImageForOCR.mockResolvedValue(mockOcrResult);

        const { getByTestId } = render(<ScanScreen />);

        // Simulate progress to reveal modal
        fireEvent.press(getByTestId('take-photo'));
        await act(async () => {
            fireEvent.press(getByTestId('cam-capture'));
        });

        await act(async () => {
            fireEvent.press(getByTestId('save-ocr'));
        });

        expect(mockAddMedication).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Med',
            dosage: '10mg',
        }));
    });
});
