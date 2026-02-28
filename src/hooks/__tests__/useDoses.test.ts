import { renderHook, act } from '@testing-library/react-native';
import { useDoses } from '../useDoses';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('useDoses', () => {
    const mockDose = {
        id: '1',
        medicationId: 'med-1',
        medicationName: 'Advil',
        scheduledTime: new Date().toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    });

    it('should load doses from storage on mount', async () => {
        const storedDoses = [mockDose];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedDoses));

        const { result } = renderHook(() => useDoses());

        // Initial load happens in useEffect
        await act(async () => {
            // Wait for internal state updates
        });

        expect(result.current.doses).toEqual(storedDoses);
        expect(result.current.loading).toBe(false);
    });

    it('should log a new dose', async () => {
        const { result } = renderHook(() => useDoses());

        await act(async () => {
            await result.current.logDose('med-1', 'Advil', 'taken', new Date().toISOString());
        });

        expect(result.current.doses.length).toBe(1);
        expect(result.current.doses[0].status).toBe('taken');
        expect(result.current.doses[0].medicationName).toBe('Advil');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should update dose status', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockDose]));
        const { result } = renderHook(() => useDoses());

        await act(async () => {
            // Wait for load
        });

        await act(async () => {
            await result.current.updateDoseStatus('1', 'taken');
        });

        expect(result.current.doses[0].status).toBe('taken');
        expect(result.current.doses[0].actualTime).toBeDefined();
    });

    it('should calculate adherence percentage correctly', async () => {
        const history = [
            { ...mockDose, id: '1', status: 'taken', scheduledTime: new Date().toISOString() },
            { ...mockDose, id: '2', status: 'missed', scheduledTime: new Date().toISOString() },
        ];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const { result } = renderHook(() => useDoses());
        await act(async () => { });

        const adherence = result.current.calculateAdherence(7);
        expect(adherence).toBe(50);
    });

    it('should return 0 adherence if no doses recorded', async () => {
        const { result } = renderHook(() => useDoses());
        await act(async () => { });

        const adherence = result.current.calculateAdherence(7);
        expect(adherence).toBe(0);
    });

    it('should filter today doses', async () => {
        const today = new Date().toISOString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const history = [
            { ...mockDose, id: '1', scheduledTime: today },
            { ...mockDose, id: '2', scheduledTime: yesterday.toISOString() },
        ];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const { result } = renderHook(() => useDoses());
        await act(async () => { });

        const todayDoses = result.current.getTodayDoses();
        expect(todayDoses.length).toBe(1);
        expect(todayDoses[0].id).toBe('1');
    });

    it('should delete a dose', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockDose]));
        const { result } = renderHook(() => useDoses());
        await act(async () => { });

        await act(async () => {
            await result.current.deleteDose('1');
        });

        expect(result.current.doses.length).toBe(0);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(expect.any(String), JSON.stringify([]));
    });
});
