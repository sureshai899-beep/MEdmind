import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ContactDirectoryScreen } from '../ContactDirectoryScreen';
import { useRouter } from 'expo-router';
import { useContacts } from '../../../hooks/useContacts';
import { Alert, Linking } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('../../../hooks/useContacts', () => ({
    useContacts: jest.fn(),
}));

// Mock Linking
jest.spyOn(Linking, 'openURL');

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock components
jest.mock('../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('ContactDirectoryScreen', () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };
    const mockDeleteContact = jest.fn();
    const mockContacts = [
        { id: '1', name: 'Dr. Smith', type: 'doctor', specialty: 'Cardiology', phone: '1234567890', email: 'smith@example.com' },
        { id: '2', name: 'Main Pharmacy', type: 'pharmacy', phone: '0987654321' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useContacts as jest.Mock).mockReturnValue({
            contacts: mockContacts,
            loading: false,
            deleteContact: mockDeleteContact,
        });
    });

    it('renders contact list correctly', () => {
        const { getByText } = render(<ContactDirectoryScreen />);

        expect(getByText('Dr. Smith')).toBeTruthy();
        expect(getByText('Cardiology')).toBeTruthy();
        expect(getByText('Main Pharmacy')).toBeTruthy();
    });

    it('filters contacts by type', () => {
        const { getByText, queryByText } = render(<ContactDirectoryScreen />);

        fireEvent.press(getByText('doctor'));
        expect(getByText('Dr. Smith')).toBeTruthy();
        expect(queryByText('Main Pharmacy')).toBeNull();

        fireEvent.press(getByText('pharmacy'));
        expect(queryByText('Dr. Smith')).toBeNull();
        expect(getByText('Main Pharmacy')).toBeTruthy();
    });

    it('handles call action', () => {
        const { getAllByTestId } = render(<ContactDirectoryScreen />);

        const callIcons = getAllByTestId('icon-call');
        fireEvent.press(callIcons[0].parent || callIcons[0]);

        expect(Linking.openURL).toHaveBeenCalledWith('tel:1234567890');
    });

    it('handles email action', () => {
        const { getAllByTestId } = render(<ContactDirectoryScreen />);

        const mailIcons = getAllByTestId('icon-mail');
        fireEvent.press(mailIcons[0].parent || mailIcons[0]);

        expect(Linking.openURL).toHaveBeenCalledWith('mailto:smith@example.com');
    });

    it('handles contact deletion with confirmation', () => {
        const { getAllByTestId } = render(<ContactDirectoryScreen />);

        const deleteButtons = getAllByTestId('delete-contact');
        fireEvent.press(deleteButtons[0]);

        expect(Alert.alert).toHaveBeenCalledWith(
            "Delete Contact",
            expect.any(String),
            expect.arrayContaining([
                expect.objectContaining({ text: "Cancel" }),
                expect.objectContaining({ text: "Delete" }),
            ])
        );

        // Simulate press delete button in Alert
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const deleteBtn = alertCalls[0][2].find((b: any) => b.text === 'Delete');
        deleteBtn.onPress();

        expect(mockDeleteContact).toHaveBeenCalledWith('1');
    });

    it('navigates to add contact screen', () => {
        const { getByTestId } = render(<ContactDirectoryScreen />);
        fireEvent.press(getByTestId('icon-add').parent || getByTestId('icon-add'));
        expect(mockRouter.push).toHaveBeenCalledWith('/contacts/add');
    });
});
