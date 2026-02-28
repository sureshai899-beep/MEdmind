import { renderHook, act } from '@testing-library/react-native';
import { useNotifications } from '../useNotifications';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    cancelScheduledNotificationAsync: jest.fn(),
    cancelAllScheduledNotificationsAsync: jest.fn(),
    getAllScheduledNotificationsAsync: jest.fn(),
    setBadgeCountAsync: jest.fn(),
    addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    removeNotificationSubscription: jest.fn(),
    setNotificationChannelAsync: jest.fn(),
    AndroidImportance: { MAX: 4 },
    AndroidNotificationPriority: { HIGH: 4 },
    SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
}));

describe('useNotifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
    });

    it('should check permissions on mount', async () => {
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        const { result } = renderHook(() => useNotifications());

        await act(async () => { });

        expect(result.current.permissionStatus.granted).toBe(true);
    });

    it('should request permissions and get push token', async () => {
        (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: 'fake-token' });

        const { result } = renderHook(() => useNotifications());

        let granted;
        await act(async () => {
            granted = await result.current.requestPermissions();
        });

        expect(granted).toBe(true);
        expect(result.current.expoPushToken).toBe('fake-token');
    });

    it('should handle permission denial', async () => {
        (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

        const { result } = renderHook(() => useNotifications());

        let granted;
        await act(async () => {
            granted = await result.current.requestPermissions();
        });

        expect(granted).toBe(false);
        expect(result.current.error).toBeDefined();
    });

    it('should schedule medication reminder', async () => {
        const { result } = renderHook(() => useNotifications());
        const date = new Date();

        await act(async () => {
            await result.current.scheduleMedicationReminder('Advil', '200mg', date, 'day');
        });

        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
            content: expect.objectContaining({
                title: expect.stringContaining('Medication'),
                body: expect.stringContaining('Advil'),
            }),
            trigger: expect.objectContaining({
                type: 'daily',
            }),
        }));
    });

    it('should schedule refill reminder', async () => {
        const { result } = renderHook(() => useNotifications());

        await act(async () => {
            await result.current.scheduleRefillReminder('Advil', 5);
        });

        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
            content: expect.objectContaining({
                title: expect.stringContaining('Refill'),
            }),
        }));
    });

    it('should cancel notification', async () => {
        const { result } = renderHook(() => useNotifications());

        await act(async () => {
            await result.current.cancelNotification('id-123');
        });

        expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('id-123');
    });
});
