import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DayData {
    day: number;
    level: 0 | 1 | 2 | 3; // 0: None, 1: Low, 2: Med, 3: High (compliant)
}

interface CalendarHeatmapProps {
    month: string;
    year: number;
    data: DayData[];
    onDayPress?: (day: number) => void;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
    month,
    year,
    data,
    onDayPress,
}) => {
    const renderDay = (item: DayData) => {
        let backgroundColor = '#1A2E2A'; // Level 0
        if (item.level === 1) backgroundColor = '#EF444460'; // Low
        if (item.level === 2) backgroundColor = '#F59E0B60'; // Med
        if (item.level === 3) backgroundColor = '#10D9A5'; // High

        return (
            <TouchableOpacity
                key={item.day}
                onPress={() => onDayPress?.(item.day)}
                style={[styles.dayBox, { backgroundColor }]}
            >
                <Text style={styles.dayText}>{item.day}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{month} {year}</Text>
                <View style={styles.legend}>
                    <View style={[styles.legendItem, { backgroundColor: '#EF4444' }]} />
                    <View style={[styles.legendItem, { backgroundColor: '#F59E0B' }]} />
                    <View style={[styles.legendItem, { backgroundColor: '#10D9A5' }]} />
                </View>
            </View>

            <View style={styles.grid}>
                {data.map(renderDay)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A2E2A',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    legend: {
        flexDirection: 'row',
        gap: 6,
    },
    legendItem: {
        width: 12,
        height: 12,
        borderRadius: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayBox: {
        width: '12%',
        aspectRatio: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
});
