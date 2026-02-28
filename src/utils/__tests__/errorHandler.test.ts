import { parseApiError, ErrorType, getUserFriendlyMessage, handleAsyncError, formatErrorForDisplay } from '../errorHandler';

describe('errorHandler', () => {
    describe('parseApiError', () => {
        it('should return NETWORK error when no response is present', () => {
            const error = new Error('Network failure');
            const result = parseApiError(error);
            expect(result.code).toBe(ErrorType.NETWORK);
            expect(result.message).toContain('internet connection');
        });

        it('should handle 401 Authentication error', () => {
            const error = { response: { status: 401, data: {} } };
            const result = parseApiError(error);
            expect(result.code).toBe(ErrorType.AUTHENTICATION);
            expect(result.statusCode).toBe(401);
        });

        it('should handle 404 Not Found error', () => {
            const error = { response: { status: 404, data: {} } };
            const result = parseApiError(error);
            expect(result.code).toBe(ErrorType.NOT_FOUND);
        });

        it('should handle 400 Validation error with custom message', () => {
            const error = { response: { status: 400, data: { message: 'Bad request details' } } };
            const result = parseApiError(error);
            expect(result.code).toBe(ErrorType.VALIDATION);
            expect(result.message).toBe('Bad request details');
        });

        it('should handle 500 Server error', () => {
            const error = { response: { status: 500, data: {} } };
            const result = parseApiError(error);
            expect(result.code).toBe(ErrorType.SERVER);
        });
    });

    describe('getUserFriendlyMessage', () => {
        it('should return string message directly', () => {
            expect(getUserFriendlyMessage('Custom Error')).toBe('Custom Error');
        });

        it('should return error.message if present', () => {
            expect(getUserFriendlyMessage({ message: 'Error object' })).toBe('Error object');
        });

        it('should parse API error if response is present', () => {
            const error = { response: { status: 401, data: {} } };
            expect(getUserFriendlyMessage(error)).toContain('expired');
        });
    });

    describe('handleAsyncError', () => {
        it('should return data on success', async () => {
            const fn = jest.fn().mockResolvedValue('success-data');
            const { data, error } = await handleAsyncError(fn);
            expect(data).toBe('success-data');
            expect(error).toBeNull();
        });

        it('should return parsed error on failure', async () => {
            const fn = jest.fn().mockRejectedValue({ response: { status: 404, data: {} } });
            const { data, error } = await handleAsyncError(fn);
            expect(data).toBeNull();
            expect(error?.code).toBe(ErrorType.NOT_FOUND);
        });
    });

    describe('formatErrorForDisplay', () => {
        it('should return correct format for Network error', () => {
            const error = { code: ErrorType.NETWORK, message: 'Offline' };
            const display = formatErrorForDisplay(error);
            expect(display.title).toBe('Connection Error');
            expect(display.icon).toBe('📡');
        });

        it('should return correct format for Server error', () => {
            const error = { code: ErrorType.SERVER, message: 'Fail' };
            const display = formatErrorForDisplay(error);
            expect(display.title).toBe('Server Error');
            expect(display.icon).toBe('🔧');
        });
    });
});
