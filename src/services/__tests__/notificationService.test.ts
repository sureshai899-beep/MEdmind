import * as Notifications from 'expo-notifications';
import { notificationService } from '../notificationService';

jest.mock('expo-notifications', () => ({
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    setNotificationChannelAsync: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    getAllScheduledNotificationsAsync: jest.fn(),
    cancelScheduledNotificationAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
    AndroidImportance: { MAX: 4 },
}));

describe('notificationService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('requestPermissions', () => {
        it('should return true if permissions are already granted', async () => {
            (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
            const result = await notificationService.requestPermissions();
            expect(result).toBe(true);
        });

        it('should request permissions and return true if granted', async () => {
            (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
            (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
            const result = await notificationService.requestPermissions();
            expect(result).toBe(true);
            expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
        });

        it('should return false if permissions are denied', async () => {
            (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
            (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
            const result = await notificationService.requestPermissions();
            expect(result).toBe(false);
        });
    });

    describe('scheduleMedicationReminder', () => {
        it('should call scheduleNotificationAsync with correct data', async () => {
            const date = new Date();
            date.setMinutes(date.getMinutes() + 10);
            (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue('test-id');

            const id = await notificationService.scheduleMedicationReminder('med-1', 'Advil', '200mg', date);

            expect(id).toBe('test-id');
            expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
                content: expect.objectContaining({
                    title: 'Medication Reminder',
                    body: "It's time to take Advil (200mg)",
                }),
                trigger: date,
            });
        });

        it('should return null if date is in the past', async () => {
            const pastDate = new Date(Date.now() - 10000);
            const id = await notificationService.scheduleMedicationReminder('med-1', 'Advil', '200mg', pastDate);
            expect(id).toBeNull();
        });
    });

    describe('cancelNotificationsByMedication', () => {
        it('should cancel all notifications matching medication ID', async () => {
            const mockScheduled = [
                { identifier: 'id-1', content: { data: { id: 'med-1' } } },
                { identifier: 'id-2', content: { data: { id: 'med-2' } } },
            ];
            (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(mockScheduled);

            await notificationService.cancelNotificationsByMedication('med-1');

            expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('id-1');
            expect(Notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalledWith('id-2');
        });
    });
});
