import { renderHook, act } from '@testing-library/react-native';
import { useOffline } from '../useOffline';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock NetInfo
const mockNetInfoUnsubscribe = jest.fn();
jest.mock('@react-native-community/netinfo', () => ({
    default: {
        addEventListener: jest.fn((callback) => {
            // Simulate initial call
            callback({ isConnected: true, isInternetReachable: true });
            return mockNetInfoUnsubscribe;
        }),
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('useOffline', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should initialize with network state', async () => {
        const { result } = renderHook(() => useOffline());

        expect(result.current.isOnline).toBe(true);
        expect(result.current.isConnected).toBe(true);
    });

    it('should load offline queue from storage on mount', async () => {
        const mockQueue = [{ id: '1', type: 'ADD_MEDICATION', payload: {}, timestamp: Date.now() }];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockQueue));

        const { result } = renderHook(() => useOffline());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.offlineQueue).toEqual(mockQueue);
        expect(result.current.hasOfflineActions).toBe(true);
    });

    it('should queue an action', async () => {
        const { result } = renderHook(() => useOffline());

        await act(async () => {
            await result.current.queueOfflineAction('LOG_DOSE', { medId: '1' });
        });

        expect(result.current.offlineQueue.length).toBe(1);
        expect(result.current.offlineQueue[0].type).toBe('LOG_DOSE');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should clear queue', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
        const { result } = renderHook(() => useOffline());

        await act(async () => {
            await result.current.clearOfflineQueue();
        });

        expect(result.current.offlineQueue).toEqual([]);
        expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
});
