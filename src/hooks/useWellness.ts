import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WellnessLog {
    date: string;
    mood: string;
    sideEffects: string[];
}

const STORAGE_KEY = '@wellness_logs';

export function useWellness() {
    const [logs, setLogs] = useState<WellnessLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            }
        } catch (error) {
            console.error('Error loading wellness logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveLog = async (log: WellnessLog) => {
        try {
            const newLogs = [log, ...logs.filter(l => l.date !== log.date)];
            setLogs(newLogs);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
        } catch (error) {
            console.error('Error saving wellness log:', error);
        }
    };

    const getLogForDate = (date: string) => {
        return logs.find(l => l.date === date);
    };

    return {
        logs,
        loading,
        saveLog,
        getLogForDate,
    };
}
