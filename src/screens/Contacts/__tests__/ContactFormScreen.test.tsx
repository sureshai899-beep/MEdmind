import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ContactFormScreen } from '../ContactFormScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useContacts } from '../../../hooks/useContacts';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useContacts', () => ({
    useContacts: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock components
jest.mock('../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('ContactFormScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };
    const mockAddContact = jest.fn();
    const mockUpdateContact = jest.fn();
    const mockContacts = [
        { id: '1', name: 'Dr. Smith', type: 'doctor', specialty: 'Cardiology', phone: '1234567890', email: 'smith@example.com' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useLocalSearchParams as jest.Mock).mockReturnValue({});
        (useContacts as jest.Mock).mockReturnValue({
            contacts: mockContacts,
            addContact: mockAddContact,
            updateContact: mockUpdateContact,
        });
    });

    it('renders "New Contact" by default', () => {
        const { getByText } = render(<ContactFormScreen />);
        expect(getByText('New Contact')).toBeTruthy();
    });

    it('renders "Edit Contact" and pre-fills data when id is provided', () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
        const { getByText, getByDisplayValue } = render(<ContactFormScreen />);

        expect(getByText('Edit Contact')).toBeTruthy();
        expect(getByDisplayValue('Dr. Smith')).toBeTruthy();
        expect(getByDisplayValue('Cardiology')).toBeTruthy();
        expect(getByDisplayValue('1234567890')).toBeTruthy();
    });

    it('validates required fields', async () => {
        const { getByText } = render(<ContactFormScreen />);

        fireEvent.press(getByText('Save Contact'));

        expect(Alert.alert).toHaveBeenCalledWith('Missing Info', expect.any(String));
        expect(mockAddContact).not.toHaveBeenCalled();
    });

    it('handles contact type selection and conditional specialty field', () => {
        const { getByText, queryByText, queryByPlaceholderText } = render(<ContactFormScreen />);

        fireEvent.press(getByText('pharmacy'));
        expect(queryByPlaceholderText('e.g. Cardiologist')).toBeNull();

        fireEvent.press(getByText('doctor'));
        expect(queryByPlaceholderText('e.g. Cardiologist')).toBeTruthy();
    });

    it('handles successful add contact', async () => {
        mockAddContact.mockResolvedValue({});
        const { getByText, getByPlaceholderText } = render(<ContactFormScreen />);

        fireEvent.changeText(getByPlaceholderText('e.g. Dr. Sarah Smith'), 'New Doctor');
        fireEvent.changeText(getByPlaceholderText('+1 234 567 890'), '9876543210');

        await act(async () => {
            fireEvent.press(getByText('Save Contact'));
        });

        expect(mockAddContact).toHaveBeenCalledWith(expect.objectContaining({
            name: 'New Doctor',
            phone: '9876543210',
        }));
        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('handles successful update contact', async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
        mockUpdateContact.mockResolvedValue({});
        const { getByText, getByDisplayValue } = render(<ContactFormScreen />);

        fireEvent.changeText(getByDisplayValue('Dr. Smith'), 'Dr. John Smith');

        await act(async () => {
            fireEvent.press(getByText('Save Contact'));
        });

        expect(mockUpdateContact).toHaveBeenCalledWith('1', expect.objectContaining({
            name: 'Dr. John Smith',
        }));
        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<ContactFormScreen />);
        fireEvent.press(getByTestId('icon-close').parent || getByTestId('icon-close'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
