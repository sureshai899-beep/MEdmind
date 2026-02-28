import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar Component', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText } = render(
            <SearchBar placeholder="Search..." value="" onChangeText={() => {}} />
        );
        expect(getByPlaceholderText('Search...')).toBeTruthy();
    });

    it('displays the provided value', () => {
        const { getByDisplayValue } = render(
            <SearchBar placeholder="Search..." value="test query" onChangeText={() => {}} />
        );
        expect(getByDisplayValue('test query')).toBeTruthy();
    });

    it('calls onChangeText when text changes', () => {
        const onChangeTextMock = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchBar placeholder="Search..." value="" onChangeText={onChangeTextMock} />
        );

        fireEvent.changeText(getByPlaceholderText('Search...'), 'new text');
        expect(onChangeTextMock).toHaveBeenCalledWith('new text');
    });

    it('renders with custom className', () => {
        const { getByPlaceholderText } = render(
            <SearchBar 
                placeholder="Search..." 
                value="" 
                onChangeText={() => {}} 
                className="custom-class"
            />
        );
        expect(getByPlaceholderText('Search...')).toBeTruthy();
    });
});
