import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../services/apiClient';
import { useOffline } from './useOffline';

export type DoseStatus = 'Taken' | 'Missed' | 'Skipped' | 'Pending';

export interface DoseLog {
    id: string;
    medicationId: string;
    medicationName: string;
    timestamp: string;
    status: DoseStatus;
    notes?: string;
    createdAt: string;
}

/**
 * Hook for managing medication dose history using TanStack Query.
 */
export function useDoses() {
    const queryClient = useQueryClient();
    const { isOnline, queueOfflineAction } = useOffline();

    // Query for fetching dose logs
    const {
        data: doses = [],
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: ['doses'],
        queryFn: async () => {
            const response = await API.doses.list();
            return response?.data?.logs || [];
        },
    });

    // Mutation for logging a dose
    const logMutation = useMutation({
        mutationFn: async (data: {
            medicationId: string;
            status: DoseStatus;
            timestamp?: string;
        }) => {
            const payload = {
                medication_id: data.medicationId,
                status: data.status,
                timestamp: data.timestamp || new Date().toISOString()
            };

            if (isOnline) {
                try {
                    const response = await API.doses.log(payload);
                    return response.data.log;
                } catch (e) {
                    await queueOfflineAction('LOG_DOSE', payload);
                }
            } else {
                await queueOfflineAction('LOG_DOSE', payload);
            }

            return {
                id: Date.now().toString(),
                ...payload,
                medicationId: data.medicationId, // Ensure camelCase for local state
            };
        },
        onSuccess: (newLog) => {
            queryClient.setQueryData(['doses'], (old: any[] = []) => [newLog, ...old]);
            queryClient.invalidateQueries({ queryKey: ['medications'] }); // Refill pill counts
        }
    });

    // Mutation for updating dose status
    const updateMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: DoseStatus }) => {
            if (isOnline) {
                try {
                    const response = await API.doses.update(id, { status });
                    return response.data.log;
                } catch (e) {
                    await queueOfflineAction('UPDATE_DOSE', { id, status });
                }
            } else {
                await queueOfflineAction('UPDATE_DOSE', { id, status });
            }
            return { id, status };
        },
        onSuccess: (updatedLog) => {
            queryClient.setQueryData(['doses'], (old: any[] = []) =>
                old.map(log => log.id === updatedLog.id ? { ...log, ...updatedLog } : log)
            );
        }
    });

    // Adherence data query
    const useAdherence = (days: number = 7) => useQuery({
        queryKey: ['adherence', days],
        queryFn: () => API.doses.adherence(days),
    });

    return {
        doses,
        loading: isLoading,
        error: queryError ? 'Failed to sync dose history' : null,
        logDose: (medId: string, name: string, status: DoseStatus, time: string) =>
            logMutation.mutateAsync({ medicationId: medId, status, timestamp: time }),
        updateDoseStatus: (id: string, status: DoseStatus) =>
            updateMutation.mutateAsync({ id, status }),
        getDosesByMedication: (medId: string) => doses.filter((d: any) => d.medicationId === medId),
        getTodayDoses: () => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            return doses.filter((d: any) => new Date(d.timestamp) >= startOfDay);
        },
        calculateAdherence: (days: number = 7) => {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            const recent = doses.filter((d: any) => new Date(d.timestamp) >= cutoff);
            if (recent.length === 0) return 0;
            return Math.round((recent.filter((d: any) => d.status === 'Taken').length / recent.length) * 100);
        },
        useAdherence,
        refresh: refetch,
    };
}
