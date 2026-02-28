import React from 'react';
import { render } from '@testing-library/react-native';
import { ListItem } from '../ListItem';
import { Text } from 'react-native';

describe('ListItem', () => {
    it('renders correctly with title and subtitle', () => {
        const { getByText } = render(
            <ListItem title="Test Title" subtitle="Test Subtitle" />
        );

        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('renders icon when provided', () => {
        const { getByText } = render(
            <ListItem title="Title" icon="💊" />
        );

        expect(getByText('💊')).toBeTruthy();
    });

    it('renders rightElement when provided', () => {
        const { getByText } = render(
            <ListItem
                title="Title"
                rightElement={<Text>Right</Text>}
            />
        );

        expect(getByText('Right')).toBeTruthy();
    });
});
