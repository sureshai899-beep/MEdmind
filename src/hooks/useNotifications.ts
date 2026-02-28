import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export interface NotificationPermissionStatus {
    granted: boolean;
    canAskAgain: boolean;
    status: string;
}

export function useNotifications() {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>({
        granted: false,
        canAskAgain: true,
        status: 'undetermined',
    });
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Request notification permissions
    const requestPermissions = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#10D9A5',
                });
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            const granted = finalStatus === 'granted';
            setPermissionStatus({
                granted,
                canAskAgain: finalStatus !== 'denied',
                status: finalStatus,
            });

            if (!granted) {
                setError('Notification permissions not granted');
                return false;
            }

            // Get push token (for remote notifications)
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);

            return true;
        } catch (err) {
            console.error('Error requesting notification permissions:', err);
            setError('Failed to request notification permissions');
            return false;
        }
    }, []);

    // Schedule a medication reminder
    const scheduleMedicationReminder = useCallback(async (
        medicationName: string,
        dosage: string,
        time: Date,
        repeatInterval?: 'day' | 'week' | 'month'
    ): Promise<string | null> => {
        try {
            const trigger: any = {
                hour: time.getHours(),
                minute: time.getMinutes(),
                repeats: !!repeatInterval,
            };

            if (repeatInterval === 'day') {
                trigger.type = 'daily';
            } else if (repeatInterval === 'week') {
                trigger.type = 'weekly';
                trigger.weekday = time.getDay();
            } else if (repeatInterval === 'month') {
                trigger.type = 'monthly';
                trigger.day = time.getDate();
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 Medication Reminder',
                    body: `Time to take ${medicationName} (${dosage})`,
                    data: {
                        type: 'medication_reminder',
                        medicationName,
                        dosage,
                    },
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger,
            });

            return notificationId;
        } catch (err) {
            console.error('Error scheduling medication reminder:', err);
            setError('Failed to schedule reminder');
            return null;
        }
    }, []);

    // Schedule a refill reminder
    const scheduleRefillReminder = useCallback(async (
        medicationName: string,
        daysLeft: number
    ): Promise<string | null> => {
        try {
            const trigger: Notifications.TimeIntervalTriggerInput = {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: daysLeft * 24 * 60 * 60, // Convert days to seconds
                repeats: false,
            };

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🔔 Refill Reminder',
                    body: `Time to refill ${medicationName}. You have ${daysLeft} days left.`,
                    data: {
                        type: 'refill_reminder',
                        medicationName,
                        daysLeft,
                    },
                    sound: true,
                },
                trigger,
            });

            return notificationId;
        } catch (err) {
            console.error('Error scheduling refill reminder:', err);
            setError('Failed to schedule refill reminder');
            return null;
        }
    }, []);

    // Cancel a specific notification
    const cancelNotification = useCallback(async (notificationId: string) => {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (err) {
            console.error('Error canceling notification:', err);
            setError('Failed to cancel notification');
        }
    }, []);

    // Cancel all notifications
    const cancelAllNotifications = useCallback(async () => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (err) {
            console.error('Error canceling all notifications:', err);
            setError('Failed to cancel all notifications');
        }
    }, []);

    // Get all scheduled notifications
    const getScheduledNotifications = useCallback(async () => {
        try {
            const notifications = await Notifications.getAllScheduledNotificationsAsync();
            return notifications;
        } catch (err) {
            console.error('Error getting scheduled notifications:', err);
            setError('Failed to get scheduled notifications');
            return [];
        }
    }, []);

    // Set badge count
    const setBadgeCount = useCallback(async (count: number) => {
        try {
            await Notifications.setBadgeCountAsync(count);
        } catch (err) {
            console.error('Error setting badge count:', err);
        }
    }, []);

    // Clear badge
    const clearBadge = useCallback(async () => {
        try {
            await Notifications.setBadgeCountAsync(0);
        } catch (err) {
            console.error('Error clearing badge:', err);
        }
    }, []);

    // Check permission status on mount
    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            setPermissionStatus({
                granted: status === 'granted',
                canAskAgain: status !== 'denied',
                status,
            });
        };

        checkPermissions();
    }, []);

    // Set up notification listeners
    useEffect(() => {
        // Listener for when notification is received while app is foregrounded
        const receivedListener = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        // Listener for when user taps on notification
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification response:', response);
            // Handle notification tap - navigate to relevant screen
            const data = response.notification.request.content.data;
            if (data.type === 'medication_reminder') {
                // TODO: Navigate to medication detail or dose logging screen
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(receivedListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    return {
        permissionStatus,
        expoPushToken,
        error,
        requestPermissions,
        scheduleMedicationReminder,
        scheduleRefillReminder,
        cancelNotification,
        cancelAllNotifications,
        getScheduledNotifications,
        setBadgeCount,
        clearBadge,
    };
}
