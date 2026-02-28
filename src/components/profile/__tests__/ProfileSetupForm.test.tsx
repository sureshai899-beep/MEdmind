import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileSetupForm } from '../ProfileSetupForm';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock components
jest.mock('../../ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('ProfileSetupForm', () => {
    const mockOnComplete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all essential fields', () => {
        const { getByText, getByPlaceholderText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        expect(getByText('Complete Your Profile')).toBeTruthy();
        expect(getByPlaceholderText('John Doe')).toBeTruthy();
        expect(getByPlaceholderText('e.g. 25')).toBeTruthy();
        expect(getByPlaceholderText('e.g. 70')).toBeTruthy();
        expect(getByText('Save & Continue')).toBeTruthy();
    });

    it('handles basic input fields', () => {
        const { getByPlaceholderText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const nameInput = getByPlaceholderText('John Doe');
        const ageInput = getByPlaceholderText('e.g. 25');

        fireEvent.changeText(nameInput, 'Vibhor');
        fireEvent.changeText(ageInput, '30');

        expect(nameInput.props.value).toBe('Vibhor');
        expect(ageInput.props.value).toBe('30');
    });

    it('handles weight and unit switching', () => {
        const { getByPlaceholderText, getByText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const weightInput = getByPlaceholderText('e.g. 70');
        const lbsButton = getByText('lbs');

        fireEvent.changeText(weightInput, '150');
        fireEvent.press(lbsButton);

        expect(weightInput.props.value).toBe('150');
        // unit state is internal but we can verify it on completion
    });

    it('handles adding and removing allergies', async () => {
        const { getByPlaceholderText, getAllByTestId, getByText, queryByText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const allergyInput = getByPlaceholderText('e.g. Penicillin');

        // Use getAllByTestId and select the second one (allergies section)
        const addButtons = getAllByTestId('icon-add');
        const addButton = addButtons[1].parent || addButtons[1];

        fireEvent.changeText(allergyInput, 'Peanuts');
        fireEvent.press(addButton);

        expect(getByText('Peanuts')).toBeTruthy();

        const closeIcon = getByText('Peanuts').parent?.findByProps({ name: 'close' }) || getAllByTestId('icon-close')[0];
        const closeButton = closeIcon.parent || closeIcon;

        fireEvent.press(closeButton);

        expect(queryByText('Peanuts')).toBeNull();
    });

    it('handles chronic condition selection', () => {
        const { getByText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const diabetesChip = getByText('Diabetes');

        fireEvent.press(diabetesChip);
        // Toggle off
        fireEvent.press(diabetesChip);
    });

    it('shows alert if name is empty on save', () => {
        const { getByText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const saveButton = getByText('Save & Continue');

        fireEvent.press(saveButton);

        expect(Alert.alert).toHaveBeenCalledWith('Required', 'Please enter your name.');
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('calls onComplete with correct data on successful save', () => {
        const { getByPlaceholderText, getByText } = render(<ProfileSetupForm onComplete={mockOnComplete} />);

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Vibhor');
        fireEvent.changeText(getByPlaceholderText('e.g. 25'), '30');
        fireEvent.press(getByText('Diabetes'));
        fireEvent.press(getByText('Save & Continue'));

        expect(mockOnComplete).toHaveBeenCalledWith({
            name: 'Vibhor',
            age: 30,
            profilePictureUrl: undefined,
            weight: undefined,
            weightUnit: 'kg',
            allergies: undefined,
            chronicConditions: ['Diabetes'],
            language: 'English',
        });
    });

    it('handles image picking success', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'mock-uri' }]
        });

        const { getByTestId } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const cameraButton = getByTestId('icon-camera').parent || getByTestId('icon-camera');

        fireEvent.press(cameraButton);

        await waitFor(() => {
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        });
    });

    it('handles image picking permission denial', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

        const { getByTestId } = render(<ProfileSetupForm onComplete={mockOnComplete} />);
        const cameraButton = getByTestId('icon-camera').parent || getByTestId('icon-camera');

        fireEvent.press(cameraButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Permission Required', expect.any(String));
        });
    });
});
