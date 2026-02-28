import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MedicationsScreen } from '../MedicationsScreen';
import { useRouter } from 'expo-router';
import { useMedications } from '../../../../hooks/useMedications';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    Link: ({ children }: any) => children,
}));

// Mock useMedications
jest.mock('../../../../hooks/useMedications', () => ({
    useMedications: jest.fn(),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../../components', () => {
    const { View, Text, TouchableOpacity, TextInput } = require('react-native');
    return {
        MedicationListItem: ({ name }: any) => <Text>{name}</Text>,
        SearchBar: ({ value, onChangeText }: any) => (
            <TextInput testID="search-bar" value={value} onChangeText={onChangeText} />
        ),
        FilterChip: ({ label, onPress, active }: any) => (
            <TouchableOpacity testID={`filter-${label}`} onPress={onPress}>
                <Text style={{ color: active ? 'blue' : 'black' }}>{label}</Text>
            </TouchableOpacity>
        ),
        FloatingActionButton: ({ onPress }: any) => (
            <TouchableOpacity testID="fab" onPress={onPress}>
                <Text>+</Text>
            </TouchableOpacity>
        ),
        EmptyState: ({ title, actionLabel, onAction }: any) => (
            <View>
                <Text>{title}</Text>
                <TouchableOpacity testID="empty-action" onPress={onAction}>
                    <Text>{actionLabel}</Text>
                </TouchableOpacity>
            </View>
        ),
    };
});

describe('MedicationsScreen', () => {
    const mockPush = jest.fn();
    const mockMedications = [
        { id: '1', name: 'Aspirin', dosage: '100mg', status: 'Active' },
        { id: '2', name: 'Vitamin C', dosage: '500mg', status: 'Completed' },
    ];
    const mockFilterByStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        (useMedications as jest.Mock).mockReturnValue({
            medications: mockMedications,
            loading: false,
            searchMedications: jest.fn(),
            filterByStatus: mockFilterByStatus,
        });
        mockFilterByStatus.mockImplementation((status) =>
            mockMedications.filter(m => m.status === status)
        );
    });

    it('should render the list of medications', () => {
        const { getByText } = render(<MedicationsScreen />);
        expect(getByText('Aspirin')).toBeTruthy();
        expect(getByText('Vitamin C')).toBeTruthy();
    });

    it('should show loading state', () => {
        (useMedications as jest.Mock).mockReturnValue({
            medications: [],
            loading: true,
            searchMedications: jest.fn(),
            filterByStatus: jest.fn(),
        });
        const { getByText } = render(<MedicationsScreen />);
        expect(getByText('Loading medications...')).toBeTruthy();
    });

    it('should filter by search query', async () => {
        const { getByTestId, queryByText, getByText } = render(<MedicationsScreen />);

        fireEvent.changeText(getByTestId('search-bar'), 'Asp');

        expect(getByText('Aspirin')).toBeTruthy();
        expect(queryByText('Vitamin C')).toBeNull();
    });

    it('should filter by status chip', async () => {
        const { getByTestId, queryByText, getByText } = render(<MedicationsScreen />);

        fireEvent.press(getByTestId('filter-Active'));

        expect(mockFilterByStatus).toHaveBeenCalledWith('Active');
        expect(getByText('Aspirin')).toBeTruthy();
        expect(queryByText('Vitamin C')).toBeNull();
    });

    it('should show empty state when no results', () => {
        const { getByTestId, getByText } = render(<MedicationsScreen />);

        fireEvent.changeText(getByTestId('search-bar'), 'UnknownMed');

        expect(getByText('No Medications Found')).toBeTruthy();
    });

    it('should navigate to scan screen via FAB', () => {
        const { getByTestId } = render(<MedicationsScreen />);

        fireEvent.press(getByTestId('fab'));

        expect(mockPush).toHaveBeenCalledWith('/scan');
    });

    it('should navigate to scan screen via empty state action', () => {
        (useMedications as jest.Mock).mockReturnValue({
            medications: [],
            loading: false,
            searchMedications: jest.fn(),
            filterByStatus: jest.fn(),
        });
        const { getByTestId } = render(<MedicationsScreen />);

        fireEvent.press(getByTestId('empty-action'));

        expect(mockPush).toHaveBeenCalledWith('/scan');
    });
});
