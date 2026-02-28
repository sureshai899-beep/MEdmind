import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MandatoryUpdateScreen } from '../MandatoryUpdateScreen';
import * as Linking from 'expo-linking';

// Mock Linking
jest.spyOn(Linking, 'openURL');

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock components
jest.mock('../../../components/ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('MandatoryUpdateScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders update title and version', () => {
        const { getByText } = render(<MandatoryUpdateScreen />);
        expect(getByText('Time for an Update!')).toBeTruthy();
        expect(getByText(/Version 1.1.8/)).toBeTruthy();
    });

    it('renders "What\'s New" section', () => {
        const { getByText } = render(<MandatoryUpdateScreen />);
        expect(getByText("What's New in v1.2.0")).toBeTruthy();
        expect(getByText(/Enhanced Drug Interaction/)).toBeTruthy();
    });

    it('handles update button press', () => {
        const { getByText } = render(<MandatoryUpdateScreen />);
        fireEvent.press(getByText('Update Now'));
        expect(Linking.openURL).toHaveBeenCalledWith('https://pillara.app/update');
    });
});
