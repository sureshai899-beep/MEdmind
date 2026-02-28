import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HelpCenterScreen } from '../HelpCenter';
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
jest.mock('../../../../../components/ui/ExpandableSection', () => {
    const { View, Text, TouchableOpacity } = require('react-native');
    const React = require('react');
    return {
        ExpandableSection: ({ title, children, icon }: any) => {
            const [expanded, setExpanded] = React.useState(false);
            return (
                <View>
                    <TouchableOpacity onPress={() => setExpanded(!expanded)} testID={`expand-${title}`}>
                        <Text>{icon} {title}</Text>
                    </TouchableOpacity>
                    {expanded && <View testID={`content-${title}`}>{children}</View>}
                </View>
            );
        }
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

describe('HelpCenterScreen', () => {
    const mockRouter = { back: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders FAQ sections', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('💊 How do I add a medication?')).toBeTruthy();
        expect(getByText('⚖️ How do I change my dosage?')).toBeTruthy();
        expect(getByText('🔒 Is my data private?')).toBeTruthy();
    });

    it('expands FAQ sections on press', () => {
        const { getByTestId, queryByTestId } = render(<HelpCenterScreen />);

        const title = 'How do I add a medication?';
        expect(queryByTestId(`content-${title}`)).toBeNull();

        fireEvent.press(getByTestId(`expand-${title}`));
        expect(getByTestId(`content-${title}`)).toBeTruthy();
    });

    it('renders contact support button', () => {
        const { getByText } = render(<HelpCenterScreen />);
        expect(getByText('Contact Support')).toBeTruthy();
    });

    it('handles back button navigation', () => {
        const { getByText } = render(<HelpCenterScreen />);
        fireEvent.press(getByText('← Back'));
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
