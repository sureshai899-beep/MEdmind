import { renderHook, act } from '@testing-library/react-native';
import { useWellness, WellnessLog } from '../useWellness';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('useWellness hook', () => {
    const mockLogs: WellnessLog[] = [
        {
            date: '2024-01-01',
            mood: 'Happy',
            sideEffects: ['None'],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('loads logs on initialization', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockLogs));

        const { result } = renderHook(() => useWellness());

        // Wait for loading to finish
        await act(async () => {
            // AsyncStorage.getItem is called inside useEffect
        });

        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@wellness_logs');
        expect(result.current.logs).toEqual(mockLogs);
        expect(result.current.loading).toBe(false);
    });

    it('handles empty storage', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() => useWellness());

        await act(async () => { });

        expect(result.current.logs).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('saves a new log', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
        const { result } = renderHook(() => useWellness());
        await act(async () => { });

        const newLog: WellnessLog = {
            date: '2024-01-02',
            mood: 'Tired',
            sideEffects: ['Headache'],
        };

        await act(async () => {
            await result.current.saveLog(newLog);
        });

        expect(result.current.logs).toContainEqual(newLog);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            '@wellness_logs',
            expect.stringContaining('2024-01-02')
        );
    });

    it('updates an existing log for the same date', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockLogs));
        const { result } = renderHook(() => useWellness());
        await act(async () => { });

        const updatedLog: WellnessLog = {
            date: '2024-01-01',
            mood: 'Neutral',
            sideEffects: ['Dizziness'],
        };

        await act(async () => {
            await result.current.saveLog(updatedLog);
        });

        expect(result.current.logs.length).toBe(1);
        expect(result.current.logs[0].mood).toBe('Neutral');
    });

    it('retrieves log for a specific date', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockLogs));
        const { result } = renderHook(() => useWellness());
        await act(async () => { });

        const log = result.current.getLogForDate('2024-01-01');
        expect(log).toEqual(mockLogs[0]);

        const nonExistentLog = result.current.getLogForDate('2024-02-01');
        expect(nonExistentLog).toBeUndefined();
    });

    it('handles errors when loading logs', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage Error'));

        const { result } = renderHook(() => useWellness());
        await act(async () => { });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading wellness logs:', expect.any(Error));
        expect(result.current.loading).toBe(false);
        consoleErrorSpy.mockRestore();
    });
});
