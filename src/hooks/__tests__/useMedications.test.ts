import { renderHook, act } from '@testing-library/react-native';
import { useMedications } from '../useMedications';
import { API } from '../../services/apiClient';
import { notificationService } from '../../services/notificationService';
import { useOffline } from '../useOffline';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../services/apiClient', () => ({
    API: {
        medications: {
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock('../../services/notificationService', () => ({
    notificationService: {
        requestPermissions: jest.fn(),
        scheduleRecurringReminders: jest.fn(),
        cancelNotificationsByMedication: jest.fn(),
    },
}));

jest.mock('../useOffline', () => ({
    useOffline: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('useMedications', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (useOffline as jest.Mock).mockReturnValue({ isOnline: true, queueOfflineAction: jest.fn() });
    });

    it('should load medications from API when online', async () => {
        const mockMeds = [{ id: '1', name: 'Advil', dosage: '200mg', frequency: 'daily' }];
        (API.medications.list as jest.Mock).mockResolvedValue(mockMeds);

        const { result } = renderHook(() => useMedications());

        await act(async () => {
            // Wait for useEffect
        });

        expect(result.current.medications).toEqual(mockMeds);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should fallback to local storage if API fails', async () => {
        (useOffline as jest.Mock).mockReturnValue({ isOnline: true });
        (API.medications.list as jest.Mock).mockRejectedValue(new Error('API Fail'));
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([{ id: 'local-1', name: 'Local Med' }]));

        const { result } = renderHook(() => useMedications());

        await act(async () => {
            // Wait for useEffect
        });

        expect(result.current.medications[0].name).toBe('Local Med');
    });

    it('should add medication and schedule notifications', async () => {
        (notificationService.requestPermissions as jest.Mock).mockResolvedValue(true);
        (API.medications.create as jest.Mock).mockResolvedValue({ success: true });

        const { result } = renderHook(() => useMedications());

        await act(async () => {
            await result.current.addMedication({
                name: 'Tylenol',
                dosage: '500mg',
                frequency: 'twice daily',
                status: 'active',
                type: 'tablet',
                inventory: { current: 10, total: 30, unit: 'tablets' }
            } as any);
        });

        expect(result.current.medications.some(m => m.name === 'Tylenol')).toBe(true);
        expect(notificationService.scheduleRecurringReminders).toHaveBeenCalled();
    });
});
