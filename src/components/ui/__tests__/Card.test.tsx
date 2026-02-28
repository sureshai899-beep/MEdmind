import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Text } from 'react-native';

describe('Card Component', () => {
    it('renders correctly with children', () => {
        const { getByText } = render(
            <Card>
                <Card.Title>Test Title</Card.Title>
                <Card.Content>
                    <Text>Test Content</Text>
                </Card.Content>
            </Card>
        );

        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Test Content')).toBeTruthy();
    });

    it('applies custom className', () => {
        const { getByTestId } = render(
            <Card className="custom-class" testID="card">
                <Card.Content>
                    <Text>Content</Text>
                </Card.Content>
            </Card>
        );

        expect(getByTestId('card')).toBeTruthy();
    });

    it('renders Card.Header correctly', () => {
        const { getByText } = render(
            <Card>
                <Card.Header>
                    <Text>Header Content</Text>
                </Card.Header>
            </Card>
        );

        expect(getByText('Header Content')).toBeTruthy();
    });

    it('renders all card sub-components together', () => {
        const { getByText } = render(
            <Card>
                <Card.Header>
                    <Text>Header</Text>
                </Card.Header>
                <Card.Title>Title</Card.Title>
                <Card.Content>
                    <Text>Content</Text>
                </Card.Content>
            </Card>
        );

        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Title')).toBeTruthy();
        expect(getByText('Content')).toBeTruthy();
    });
});
