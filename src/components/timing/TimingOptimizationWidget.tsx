import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Icon } from '../ui/Icon';
import { colors } from '../../constants/Colors';

interface TimingSuggestion {
    id: string;
    time: string;
    label: string;
    reason: string;
}

interface TimingOptimizationWidgetProps {
    onAccept: (suggestions: TimingSuggestion[]) => void;
    medicationName: string;
}

export const TimingOptimizationWidget: React.FC<TimingOptimizationWidgetProps> = ({
    onAccept,
    medicationName
}) => {
    const suggestions: TimingSuggestion[] = [
        { id: '1', time: '08:00', label: 'Morning', reason: 'Better absorption on empty stomach' },
        { id: '2', time: '20:00', label: 'Evening', reason: 'Commonly taken before bed for safety' }
    ];

    return (
        <Animated.View
            entering={FadeInRight.duration(600)}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.aiBadge}>
                    <Icon name="sparkles" size={12} color={colors.primary.DEFAULT} />
                    <Text style={styles.aiText}>AI Suggestion</Text>
                </View>
                <Text style={styles.title}>Timing Optimization</Text>
            </View>

            <Text style={styles.description}>
                Based on medical guidelines for <Text style={styles.medName}>{medicationName}</Text>, we recommend:
            </Text>

            <View style={styles.suggestionList}>
                {suggestions.map((item) => (
                    <View key={item.id} style={styles.suggestionItem}>
                        <View style={styles.timeBlock}>
                            <Text style={styles.timeText}>{item.time}</Text>
                            <Text style={styles.labelText}>{item.label}</Text>
                        </View>
                        <View style={styles.infoBlock}>
                            <Text style={styles.reasonText}>{item.reason}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onAccept(suggestions)}
            >
                <Text style={styles.acceptButtonText}>Apply AI Schedule</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: `${colors.primary.DEFAULT}0D`, // 5% opacity
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: `${colors.primary.DEFAULT}33`, // 20% opacity
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.primary.DEFAULT}26`, // 15% opacity
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    aiText: {
        color: colors.primary.DEFAULT,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        color: colors.text.secondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 16,
    },
    medName: {
        color: colors.primary.DEFAULT,
        fontWeight: 'bold',
    },
    suggestionList: {
        gap: 12,
        marginBottom: 20,
    },
    suggestionItem: {
        flexDirection: 'row',
        backgroundColor: colors.background.secondary,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        gap: 15,
    },
    timeBlock: {
        alignItems: 'center',
        width: 60,
    },
    timeText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    labelText: {
        color: colors.primary.DEFAULT,
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoBlock: {
        flex: 1,
    },
    reasonText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
    acceptButton: {
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: colors.background.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
