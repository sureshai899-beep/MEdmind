import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/Colors';

interface MedAdherence {
    name: string;
    adherence: number;
    total: number;
    taken: number;
}

interface MedicationBreakdownProps {
    data: MedAdherence[];
}

export const MedicationBreakdown: React.FC<MedicationBreakdownProps> = ({ data }) => {
    if (data.length === 0) return null;

    return (
        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.breakdownContainer}>
            <Text style={styles.sectionTitle}>By Medication</Text>
            {data.map((med, index) => (
                <View key={index} style={styles.medCard}>
                    <View style={styles.medHeader}>
                        <Text style={styles.medName}>{med.name}</Text>
                        <Text style={[
                            styles.medAdherence,
                            med.adherence >= 80 ? styles.adherenceGood :
                                med.adherence >= 50 ? styles.adherenceWarning :
                                    styles.adherencePoor
                        ]}>
                            {med.adherence}%
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${med.adherence}%`,
                                    backgroundColor: med.adherence >= 80 ? colors.status.taken :
                                        med.adherence >= 50 ? colors.status.warning : colors.status.missed
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.medStats}>
                        {med.taken} of {med.total} doses taken
                    </Text>
                </View>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    breakdownContainer: {
        marginBottom: 24,
    },
    medCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    medHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    medName: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    medAdherence: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    adherenceGood: {
        color: colors.status.taken,
    },
    adherenceWarning: {
        color: colors.status.warning,
    },
    adherencePoor: {
        color: colors.status.missed,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.ui.border,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    medStats: {
        color: colors.text.secondary,
        fontSize: 12,
    },
});
