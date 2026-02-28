import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { useOffline } from './useOffline';
import { API } from '../services/apiClient';
import { Medication } from '../utils/schemas';

// Re-export Medication type for consumers
export type { Medication };

/**
 * Hook for managing the user's medication list using TanStack Query.
 */
export function useMedications() {
    const queryClient = useQueryClient();
    const { isOnline, queueOfflineAction } = useOffline();

    // Query for fetching medications
    const {
        data: medications = [],
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: ['medications'],
        queryFn: async () => {
            const remoteMeds = await API.medications.list();
            return Array.isArray(remoteMeds) ? remoteMeds : [];
        },
    });

    // Mutation for adding medication
    const addMutation = useMutation({
        mutationFn: async (medData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
            const newMed: Medication = {
                ...medData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (isOnline) {
                try {
                    return await API.medications.create(newMed);
                } catch (e) {
                    await queueOfflineAction('ADD_MEDICATION', newMed);
                    return newMed;
                }
            } else {
                await queueOfflineAction('ADD_MEDICATION', newMed);
                return newMed;
            }
        },
        onSuccess: async (newMed) => {
            queryClient.setQueryData(['medications'], (old: Medication[] = []) => [...old, newMed]);

            // Schedule notifications
            try {
                const hasPermission = await notificationService.requestPermissions();
                if (hasPermission) {
                    const times = parseFrequencyToTimes(newMed.frequency);
                    await notificationService.scheduleRecurringReminders(newMed.id, newMed.name, newMed.dosage, times);
                }
            } catch (err) { }
        }
    });

    // Mutation for updating medication
    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Medication> }) => {
            if (isOnline) {
                try {
                    return await API.medications.update(id, updates);
                } catch (e) {
                    await queueOfflineAction('UPDATE_MEDICATION', { id, data: updates });
                }
            } else {
                await queueOfflineAction('UPDATE_MEDICATION', { id, data: updates });
            }
            return { id, ...updates };
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['medications'], (old: Medication[] = []) =>
                old.map(m => m.id === variables.id ? { ...m, ...data } : m)
            );
        }
    });

    // Mutation for deleting medication
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (isOnline) {
                try {
                    await API.medications.delete(id);
                } catch (e) {
                    await queueOfflineAction('DELETE_MEDICATION', { id });
                }
            } else {
                await queueOfflineAction('DELETE_MEDICATION', { id });
            }
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData(['medications'], (old: Medication[] = []) =>
                old.filter(m => m.id !== id)
            );
            notificationService.cancelNotificationsByMedication(id);
        }
    });

    // Helper to parse frequency string into time slots
    const parseFrequencyToTimes = (frequency: string): string[] => {
        const freq = frequency.toLowerCase();
        if (freq.includes('once') || freq === 'daily') return ['09:00'];
        if (freq.includes('twice')) return ['09:00', '21:00'];
        if (freq.includes('three') || freq.includes('tid')) return ['09:00', '15:00', '21:00'];
        if (freq.includes('four') || freq.includes('qid')) return ['08:00', '13:00', '18:00', '23:00'];
        return ['09:00'];
    };

    const decrementPillCount = useCallback(async (id: string, amount: number = 1) => {
        const med = medications.find(m => m.id === id);
        if (!med || med.pillCount === undefined) return;

        const newCount = Math.max(0, med.pillCount - amount);
        if (med.lowStockThreshold !== undefined && newCount <= med.lowStockThreshold && med.pillCount > med.lowStockThreshold) {
            await notificationService.scheduleRefillReminder(med.id, med.name, newCount);
        }

        updateMutation.mutate({ id, updates: { pillCount: newCount } });
    }, [medications, updateMutation]);

    return {
        medications,
        loading: isLoading,
        error: queryError ? 'Failed to sync medications' : null,
        addMedication: addMutation.mutateAsync,
        updateMedication: (id: string, updates: Partial<Medication>) => updateMutation.mutateAsync({ id, updates }),
        deleteMedication: deleteMutation.mutateAsync,
        getMedicationById: (id: string) => medications.find(m => m.id === id),
        searchMedications: (query: string) => medications.filter(m => m.name.toLowerCase().includes(query.toLowerCase())),
        filterByStatus: (status: Medication['status']) => medications.filter(m => m.status === status),
        decrementPillCount,
        refresh: refetch,
    };
}
