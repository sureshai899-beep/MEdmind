import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        const { getByText } = render(<Button>Click Me</Button>);
        expect(getByText('Click Me')).toBeTruthy();
    });

    it('calls onPress when clicked', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button onPress={onPressMock}>Click Me</Button>);

        fireEvent.press(getByText('Click Me'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders with primary variant', () => {
        const { getByText } = render(<Button variant="primary">Primary</Button>);
        const button = getByText('Primary').parent;
        expect(button).toBeTruthy();
    });

    it('renders with secondary variant', () => {
        const { getByText } = render(<Button variant="secondary">Secondary</Button>);
        expect(getByText('Secondary')).toBeTruthy();
    });

    it('renders with outline variant', () => {
        const { getByText } = render(<Button variant="outline">Outline</Button>);
        expect(getByText('Outline')).toBeTruthy();
    });

    it('renders with different sizes', () => {
        const { getByText: getSmall } = render(<Button size="sm">Small</Button>);
        expect(getSmall('Small')).toBeTruthy();

        const { getByText: getMedium } = render(<Button size="md">Medium</Button>);
        expect(getMedium('Medium')).toBeTruthy();

        const { getByText: getLarge } = render(<Button size="lg">Large</Button>);
        expect(getLarge('Large')).toBeTruthy();
    });

    it('disables button when disabled prop is true', () => {
        const onPressMock = jest.fn();
        const { getByRole } = render(
            <Button disabled onPress={onPressMock}>
                Disabled
            </Button>
        );

        expect(getByRole('button', { disabled: true })).toBeTruthy();
    });

    it('shows loading indicator when loading prop is true', () => {
        const { queryByText, UNSAFE_getByType } = render(<Button loading>Loading</Button>);

        // Text should not be visible when loading
        expect(queryByText('Loading')).toBeNull();

        // ActivityIndicator should be present
        const activityIndicator = UNSAFE_getByType('ActivityIndicator');
        expect(activityIndicator).toBeTruthy();
    });

    it('applies custom className', () => {
        const { getByText } = render(<Button className="custom-class">Custom</Button>);
        expect(getByText('Custom')).toBeTruthy();
    });

    it('renders with testID', () => {
        const { getByTestId } = render(<Button testID="test-button">Test</Button>);
        expect(getByTestId('test-button')).toBeTruthy();
    });
});
