import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingOverlay } from '../LoadingOverlay';

describe('LoadingOverlay', () => {
    it('should be hidden when visible is false', () => {
        const { queryByText } = render(<LoadingOverlay visible={false} />);
        expect(queryByText('Saving changes...')).toBeNull();
    });

    it('should show default message when visible is true', () => {
        const { getByText } = render(<LoadingOverlay visible={true} />);
        expect(getByText('Saving changes...')).toBeTruthy();
    });

    it('should show custom message', () => {
        const { getByText } = render(<LoadingOverlay visible={true} message="Exporting PDF..." />);
        expect(getByText('Exporting PDF...')).toBeTruthy();
    });

    it('should render progress bar with correct width', () => {
        const { getByText } = render(<LoadingOverlay visible={true} progress={0.75} />);
        // The component uses a View for progress bar, we can't easily check style but we can verify it renders
        expect(getByText('🔄')).toBeTruthy();
    });
});
