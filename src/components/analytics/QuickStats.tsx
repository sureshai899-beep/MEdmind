import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/Colors';

interface QuickStatsProps {
    adherence: number;
    streak: number;
    taken: number;
    missed: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ adherence, streak, taken, missed }) => {
    return (
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardPrimary]}>
                <Text style={styles.statValue}>{adherence}%</Text>
                <Text style={styles.statLabel}>Adherence</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{taken}</Text>
                <Text style={styles.statLabel}>Taken</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={[styles.statValue, styles.statValueWarning]}>{missed}</Text>
                <Text style={styles.statLabel}>Missed</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    statCardPrimary: {
        backgroundColor: `${colors.primary.DEFAULT}1A`,
        borderColor: colors.primary.DEFAULT,
    },
    statValue: {
        color: colors.text.primary,
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 4,
    },
    statValueWarning: {
        color: colors.status.missed,
    },
    statLabel: {
        color: colors.text.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
});
