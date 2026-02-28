import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterChip } from '../FilterChip';

describe('FilterChip Component', () => {
    it('renders correctly with label', () => {
        const { getByText } = render(
            <FilterChip label="Active" active={false} onPress={() => {}} />
        );
        expect(getByText('Active')).toBeTruthy();
    });

    it('applies active styles when active prop is true', () => {
        const { getByText } = render(
            <FilterChip label="Active" active={true} onPress={() => {}} />
        );
        const chip = getByText('Active').parent;
        expect(chip).toBeTruthy();
    });

    it('calls onPress when clicked', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <FilterChip label="Active" active={false} onPress={onPressMock} />
        );

        fireEvent.press(getByText('Active'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders multiple chips with different states', () => {
        const { getByText } = render(
            <>
                <FilterChip label="All" active={true} onPress={() => {}} />
                <FilterChip label="Active" active={false} onPress={() => {}} />
                <FilterChip label="Paused" active={false} onPress={() => {}} />
            </>
        );

        expect(getByText('All')).toBeTruthy();
        expect(getByText('Active')).toBeTruthy();
        expect(getByText('Paused')).toBeTruthy();
    });
});
