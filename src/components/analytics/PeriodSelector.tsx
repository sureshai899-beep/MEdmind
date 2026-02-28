import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/Colors';

export type TimePeriod = '7' | '30' | '90' | 'all';

interface PeriodSelectorProps {
    selectedPeriod: TimePeriod;
    onPeriodChange: (period: TimePeriod) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
    const periods: { label: string; value: TimePeriod }[] = [
        { label: '7 Days', value: '7' },
        { label: '30 Days', value: '30' },
        { label: '90 Days', value: '90' },
        { label: 'All Time', value: 'all' },
    ];

    return (
        <Animated.View entering={FadeInUp.duration(600)} style={styles.periodSelector}>
            {periods.map((period) => (
                <TouchableOpacity
                    key={period.value}
                    onPress={() => onPeriodChange(period.value)}
                    style={[
                        styles.periodButton,
                        selectedPeriod === period.value && styles.periodButtonActive
                    ]}
                >
                    <Text style={[
                        styles.periodText,
                        selectedPeriod === period.value && styles.periodTextActive
                    ]}>
                        {period.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    periodSelector: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.ui.border,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: `${colors.primary.DEFAULT}1A`,
        borderColor: colors.primary.DEFAULT,
    },
    periodText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: '600',
    },
    periodTextActive: {
        color: colors.primary.DEFAULT,
    },
});
