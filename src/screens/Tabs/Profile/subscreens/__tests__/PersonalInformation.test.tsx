import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PersonalInformationScreen } from '../PersonalInformation';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../../../components/form/FormInput', () => {
    const { View, Text, TextInput } = require('react-native');
    return {
        FormInput: ({ label, value, onChangeText, error }: any) => (
            <View>
                <Text>{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    testID={`input-${label}`}
                />
                {error && <Text>{error}</Text>}
            </View>
        ),
    };
});

jest.mock('../../../../../components/ui/Button', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return {
        Button: ({ children, onPress }: any) => (
            <TouchableOpacity onPress={onPress}>
                <Text>{children}</Text>
            </TouchableOpacity>
        ),
    };
});

jest.mock('../../../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('PersonalInformationScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders initial values correctly', () => {
        const { getByDisplayValue, getByTestId } = render(<PersonalInformationScreen />);

        expect(getByDisplayValue('John Doe')).toBeTruthy();
        expect(getByDisplayValue('john.doe@example.com')).toBeTruthy();
        expect(getByDisplayValue('+1 234 567 8900')).toBeTruthy();
        expect(getByTestId('icon-person')).toBeTruthy();
    });

    it('validates required fields and email format', () => {
        const { getByText, getByTestId, getByDisplayValue } = render(<PersonalInformationScreen />);

        const nameInput = getByTestId('input-Full Name');
        const emailInput = getByTestId('input-Email Address');

        fireEvent.changeText(nameInput, '');
        fireEvent.changeText(emailInput, 'invalid-email');

        fireEvent.press(getByText('Save Changes'));

        expect(getByText('Name is required')).toBeTruthy();
        expect(getByText('Invalid email format')).toBeTruthy();
        expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it('handles successful save', () => {
        const { getByText } = render(<PersonalInformationScreen />);

        fireEvent.press(getByText('Save Changes'));

        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('handles back button navigation', () => {
        const { getByRole } = render(<PersonalInformationScreen />);
        fireEvent.press(getByRole('button', { name: 'Go back' }));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
