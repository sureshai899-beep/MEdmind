import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { HealthProfileScreen } from '../HealthProfile';
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
        FormInput: ({ label, value, onChangeText, placeholder, error }: any) => (
            <View>
                <Text>{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
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

describe('HealthProfileScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders initial values correctly', () => {
        const { getByDisplayValue } = render(<HealthProfileScreen />);

        expect(getByDisplayValue('O+')).toBeTruthy();
        expect(getByDisplayValue('Penicillin, Peanuts')).toBeTruthy();
        expect(getByDisplayValue('Hypertension, Type 2 Diabetes')).toBeTruthy();
    });

    it('validates required fields', () => {
        const { getByText, getByTestId, getByDisplayValue } = render(<HealthProfileScreen />);

        const allergiesInput = getByTestId('input-Allergies');
        const conditionsInput = getByTestId('input-Medical Conditions');

        fireEvent.changeText(allergiesInput, '');
        fireEvent.changeText(conditionsInput, '');

        fireEvent.press(getByText('Save Health Profile'));

        expect(getByText(/Allergies information is required/)).toBeTruthy();
        expect(getByText(/Medical conditions are required/)).toBeTruthy();
        expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it('handles successful save', () => {
        const { getByText } = render(<HealthProfileScreen />);

        fireEvent.press(getByText('Save Health Profile'));

        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('handles back button navigation', () => {
        const { getByText } = render(<HealthProfileScreen />);
        fireEvent.press(getByText('← Back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
