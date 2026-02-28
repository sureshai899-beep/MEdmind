import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    /**
     * Request permissions for notifications
     */
    async requestPermissions() {
        if (Platform.OS === 'web') return false;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        // Android channels are required for notifications to show correctly on Android 8.0+
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('medication-reminders', {
                name: 'Medication Reminders',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#10D9A5',
            });
        }

        return true;
    },

    /**
     * Schedule a notification for a medication dose
     */
    async scheduleMedicationReminder(medicationId: string, medicationName: string, dosage: string, date: Date) {
        if (date < new Date()) return null;

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Medication Reminder',
                body: `It's time to take ${medicationName} (${dosage})`,
                data: { type: 'medication', id: medicationId, name: medicationName },
                sound: true,
                badge: 1,
            },
            trigger: date as any,
        });

        return id;
    },

    /**
     * Schedule recurring reminders for a medication
     */
    async scheduleRecurringReminders(medicationId: string, medicationName: string, dosage: string, times: string[]) {
        const ids: string[] = [];

        for (const time of times) {
            const [hour, minute] = time.split(':').map(Number);

            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Medication Reminder',
                    body: `It's time to take ${medicationName} (${dosage})`,
                    data: { type: 'medication', id: medicationId, name: medicationName },
                    sound: true,
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true,
                } as Notifications.NotificationTriggerInput,
            });
            ids.push(id);
        }

        return ids;
    },

    /**
     * Cancel notifications for a specific medication
     */
    async cancelNotificationsByMedication(medicationId: string) {
        // Expo doesn't support filtering by data easily on all platforms without storing the IDs
        // Usually we store the notification IDs in the medication object
        // For now, we'll cancel all and let the app reschedule, or assume we handle it via IDs
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const notification of scheduled) {
            const data = notification.content.data;
            if (data && data.id === medicationId) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }
    },

    /**
     * Cancel all scheduled notifications
     */
    async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    /**
     * Cancel a specific notification
     */
    async cancelNotification(id: string) {
        await Notifications.cancelScheduledNotificationAsync(id);
    },

    /**
     * Send a test notification immediately
     */
    async testNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Pillara Test',
                body: 'This is a test notification to verify your settings.',
                data: { type: 'test' },
            },
            trigger: null, // Send immediately
        });
    },

    /**
     * Schedule a notification for low medication stock
     */
    async scheduleRefillReminder(medicationId: string, medicationName: string, remainingCount: number) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Refill Reminder',
                body: `You are running low on ${medicationName}. Only ${remainingCount} pills left.`,
                data: { type: 'refill', id: medicationId },
                sound: true,
                badge: 1,
            },
            trigger: null, // Send immediately when low
        });
    }
};
