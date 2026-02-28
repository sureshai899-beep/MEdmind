import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/apiClient';

// Use require to bypass Metro resolution issues with @react-native-community/netinfo
const NetInfo = require('@react-native-community/netinfo').default;

interface OfflineAction {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
}

const OFFLINE_QUEUE_KEY = '@pillara_offline_queue';

export function useOffline() {
    const [isOnline, setIsOnline] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsOnline(state.isConnected ?? false);
            setIsConnected(state.isInternetReachable ?? false);

            // If back online, process queue
            if (state.isConnected && state.isInternetReachable) {
                processOfflineQueue();
            }
        });

        // Load offline queue on mount
        loadOfflineQueue();

        return () => unsubscribe();
    }, []);

    /**
     * Load offline queue from storage
     */
    const loadOfflineQueue = async () => {
        try {
            const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
            if (stored) {
                const queue = JSON.parse(stored);
                setOfflineQueue(queue);
            }
        } catch (error) {
            console.error('Failed to load offline queue:', error);
        }
    };

    /**
     * Save offline queue to storage
     */
    const saveOfflineQueue = async (queue: OfflineAction[]) => {
        try {
            await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    };

    /**
     * Add action to offline queue
     */
    const queueOfflineAction = useCallback(async (type: string, payload: any) => {
        const action: OfflineAction = {
            id: Date.now().toString(),
            type,
            payload,
            timestamp: Date.now(),
        };

        const newQueue = [...offlineQueue, action];
        setOfflineQueue(newQueue);
        await saveOfflineQueue(newQueue);
    }, [offlineQueue]);

    /**
     * Process offline queue when back online
     */
    const processOfflineQueue = useCallback(async () => {
        if (offlineQueue.length === 0) return;

        console.log(`Processing ${offlineQueue.length} offline actions...`);

        const failedActions: OfflineAction[] = [];

        for (const action of offlineQueue) {
            try {
                // Process action based on type
                await processAction(action);
                console.log(`Processed offline action: ${action.type}`);
            } catch (error) {
                console.error(`Failed to process offline action: ${action.type}`, error);
                failedActions.push(action);
            }
        }

        // Update queue with failed actions
        setOfflineQueue(failedActions);
        await saveOfflineQueue(failedActions);
    }, [offlineQueue]);

    /**
     * Process individual action
     */
    const processAction = async (action: OfflineAction) => {

        switch (action.type) {
            case 'ADD_MEDICATION':
                return await API.medications.create(action.payload);
            case 'UPDATE_MEDICATION':
                return await API.medications.update(action.payload.id, action.payload.data);
            case 'DELETE_MEDICATION':
                return await API.medications.delete(action.payload.id);
            case 'LOG_DOSE':
                return await API.doses.log(action.payload);
            case 'UPDATE_DOSE':
                return await API.doses.update(action.payload.id, { status: action.payload.status });
            default:
                console.warn(`Unknown action type: ${action.type}`);
        }
    };

    /**
     * Clear offline queue
     */
    const clearOfflineQueue = useCallback(async () => {
        setOfflineQueue([]);
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    }, []);

    /**
     * Retry failed actions
     */
    const retryOfflineActions = useCallback(async () => {
        if (isOnline && isConnected) {
            await processOfflineQueue();
        }
    }, [isOnline, isConnected, processOfflineQueue]);

    return {
        isOnline,
        isConnected,
        offlineQueue,
        queueOfflineAction,
        processOfflineQueue,
        clearOfflineQueue,
        retryOfflineActions,
        hasOfflineActions: offlineQueue.length > 0,
    };
}
