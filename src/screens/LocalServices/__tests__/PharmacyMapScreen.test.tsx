import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PharmacyMapScreen } from '../PharmacyMapScreen';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
    const { View, TouchableOpacity } = require('react-native');
    const MapView = (props: any) => <View {...props}>{props.children}</View>;
    const Marker = (props: any) => (
        <TouchableOpacity testID={`marker-${props.coordinate.latitude}`} onPress={props.onPress}>
            {props.children}
        </TouchableOpacity>
    );
    return {
        __esModule: true,
        default: MapView,
        Marker,
        PROVIDER_GOOGLE: 'google',
    };
});

// Mock Linking
jest.spyOn(Linking, 'openURL');

// Mock components
jest.mock('../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('PharmacyMapScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders the map and markers', () => {
        const { getAllByTestId } = render(<PharmacyMapScreen />);
        expect(getAllByTestId(/marker-/).length).toBe(4);
    });

    it('shows pharmacy details on marker press', () => {
        const { getByText, getAllByTestId } = render(<PharmacyMapScreen />);

        const markers = getAllByTestId(/marker-/);
        fireEvent.press(markers[0]);

        expect(getByText('Apollo Pharmacy')).toBeTruthy();
        expect(getByText('Andheri East, Mumbai')).toBeTruthy();
    });

    it('handles directions and call buttons', () => {
        const { getAllByTestId, getByTestId } = render(<PharmacyMapScreen />);

        const markers = getAllByTestId(/marker-/);
        fireEvent.press(markers[0]);

        // Directions
        const directionsButton = getByTestId('directions-button');
        fireEvent.press(directionsButton);
        expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('q=19.1176,72.8712'));

        // Call
        const callButton = getByTestId('call-button');
        fireEvent.press(callButton);
        expect(Linking.openURL).toHaveBeenCalledWith('tel:022-12345678');
    });

    it('handles back button navigation', () => {
        const { getByTestId } = render(<PharmacyMapScreen />);
        fireEvent.press(getByTestId('icon-arrow-back').parent || getByTestId('icon-arrow-back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
