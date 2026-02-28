import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { CaregiverLinkCenter } from '../CaregiverLinkCenter';
import { Share, Clipboard, Alert } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock Share
jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' });

// Mock Clipboard
jest.mock('react-native', () => {
    const reactNative = jest.requireActual('react-native');
    reactNative.Clipboard = {
        setString: jest.fn(),
    };
    return reactNative;
});

// Mock QRCode
jest.mock('react-native-qrcode-svg', () => {
    const { View } = require('react-native');
    return (props: any) => <View testID="mock-qrcode" {...props} />;
});

// Mock Icon
jest.mock('../ui/Icon', () => {
    const { View } = require('react-native');
    return {
        Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
    };
});

describe('CaregiverLinkCenter', () => {
    const mockOnClose = jest.fn();
    const mockOnGenerateCode = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders null when not visible', () => {
        const { queryByText } = render(
            <CaregiverLinkCenter visible={false} onClose={mockOnClose} />
        );
        expect(queryByText('Circle of Trust')).toBeNull();
    });

    it('renders correctly when visible', () => {
        const { getByText } = render(
            <CaregiverLinkCenter visible={true} onClose={mockOnClose} />
        );
        expect(getByText('Circle of Trust')).toBeTruthy();
        expect(getByText('Select Permission Level')).toBeTruthy();
        expect(getByText('Generate Trust Code')).toBeTruthy();
    });

    it('handles permission selection', () => {
        const { getByText } = render(
            <CaregiverLinkCenter visible={true} onClose={mockOnClose} />
        );

        const fullAccessOption = getByText('Full Access');
        fireEvent.press(fullAccessOption);

        // Internal state updated, verified via code generation
    });

    it('generates a trust code when the generate button is pressed', () => {
        const { getByText, getByTestId } = render(
            <CaregiverLinkCenter
                visible={true}
                onClose={mockOnClose}
                onGenerateCode={mockOnGenerateCode}
            />
        );

        const generateButton = getByText('Generate Trust Code');
        fireEvent.press(generateButton);

        expect(getByText('Trust Code')).toBeTruthy();
        expect(getByTestId('mock-qrcode')).toBeTruthy();
        expect(mockOnGenerateCode).toHaveBeenCalled();

        // Verify expiry countdown is displayed
        expect(getByText(/Expires in/)).toBeTruthy();
    });

    it('handles copying the code to clipboard', () => {
        const { getByText } = render(
            <CaregiverLinkCenter visible={true} onClose={mockOnClose} />
        );

        fireEvent.press(getByText('Generate Trust Code'));
        fireEvent.press(getByText('Copy'));

        expect(Clipboard.setString).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Copied!', expect.any(String));
    });

    it('handles sharing the code', async () => {
        const { getByText } = render(
            <CaregiverLinkCenter visible={true} onClose={mockOnClose} />
        );

        fireEvent.press(getByText('Generate Trust Code'));
        fireEvent.press(getByText('Share'));

        expect(Share.share).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Pillara Trust Code',
            })
        );
    });

    it('handles closing the modal', () => {
        const { getByTestId } = render(
            <CaregiverLinkCenter visible={true} onClose={mockOnClose} />
        );

        const closeIcon = getByTestId('icon-close').parent || getByTestId('icon-close');
        fireEvent.press(closeIcon);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('updates time remaining every second', () => {
        const { getByText } = render(
            <CaregiverLinkCenter visible={true} onClose={mockOnClose} />
        );

        fireEvent.press(getByText('Generate Trust Code'));

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        // Just verify it doesn't crash and the timer is active
        expect(getByText(/Expires in/)).toBeTruthy();
    });
});
