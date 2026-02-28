import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Icon } from '../../components/ui/Icon';
import { useMedications } from '../../hooks/useMedications';
import { drugSafetyService, DrugInteraction } from '../../services/drugSafetyService';

export function InteractionDashboardScreen() {
    const router = useRouter();
    const { medications, loading: loadingMeds } = useMedications();
    const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAllInteractions = async () => {
            if (medications.length > 0) {
                setLoading(true);
                const results = await drugSafetyService.checkInteractions(medications);
                setInteractions(results);
                setLoading(false);
            } else {
                setInteractions([]);
                setLoading(false);
            }
        };

        if (!loadingMeds) {
            checkAllInteractions();
        }
    }, [medications, loadingMeds]);

    const getSeverityDetails = (severity: DrugInteraction['severity']) => {
        switch (severity) {
            case 'High':
                return { color: '#EF4444', bg: '#FEF2F2', icon: 'warning' };
            case 'Moderate':
                return { color: '#F59E0B', bg: '#FFFBEB', icon: 'info' };
            case 'Minor':
                return { color: '#3B82F6', bg: '#EFF6FF', icon: 'info' };
            default:
                return { color: '#718096', bg: '#F7FAFC', icon: 'info' };
        }
    };

    const groupedInteractions = {
        High: interactions.filter(i => i.severity === 'High'),
        Moderate: interactions.filter(i => i.severity === 'Moderate'),
        Minor: interactions.filter(i => i.severity === 'Minor'),
    };

    if (loading || loadingMeds) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10D9A5" />
                <Text style={styles.loadingText}>Checking for interactions...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    testID="interaction-back-button"
                >
                    <Icon name="arrow-back" size={24} color="#10D9A5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Drug Interactions</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.duration(600)} style={styles.introCard}>
                    <Text style={styles.introTitle}>Safety Analysis</Text>
                    <Text style={styles.introDescription}>
                        We've analyzed your {medications.length} active medications for potential interactions.
                    </Text>
                    {interactions.length === 0 ? (
                        <View style={styles.safeContainer}>
                            <Icon name="checkmark-circle" size={48} color="#10D9A5" />
                            <Text style={styles.safeText}>No interactions detected!</Text>
                        </View>
                    ) : (
                        <View style={styles.warningSummary}>
                            <Text style={styles.warningCount}>
                                {interactions.length} potential interaction{interactions.length > 1 ? 's' : ''} found.
                            </Text>
                        </View>
                    )}
                </Animated.View>

                {interactions.length > 0 && (
                    <View style={styles.interactionList}>
                        {(['High', 'Moderate', 'Minor'] as const).map((severity) => {
                            const items = groupedInteractions[severity];
                            if (items.length === 0) return null;

                            const details = getSeverityDetails(severity);

                            return (
                                <View key={severity} style={styles.severitySection}>
                                    <View style={[styles.severityHeader, { backgroundColor: details.bg }]}>
                                        <Icon name={details.icon as any} size={20} color={details.color} />
                                        <Text style={[styles.severityTitle, { color: details.color }]}>
                                            {severity} Severity
                                        </Text>
                                    </View>

                                    {items.map((interaction, index) => (
                                        <Animated.View
                                            key={interaction.id}
                                            entering={FadeInDown.delay(200 + index * 100)}
                                            style={styles.interactionCard}
                                        >
                                            <View style={styles.drugChips}>
                                                {interaction.affectedDrugs.map((drug, dIdx) => (
                                                    <View key={dIdx} style={styles.drugChip}>
                                                        <Text style={styles.drugChipText}>{drug}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                            <Text style={styles.interactionDescription}>
                                                {interaction.description}
                                            </Text>
                                            <TouchableOpacity style={styles.learnMoreButton}>
                                                <Text style={styles.learnMoreText}>Recommended Action</Text>
                                                <Icon name="arrow-forward" size={16} color="#10D9A5" />
                                            </TouchableOpacity>
                                        </Animated.View>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Additional Info */}
                <View style={styles.disclaimerCard}>
                    <Icon name="info" size={20} color="#A0AEC0" />
                    <Text style={styles.disclaimerText}>
                        This information is mock data for demonstration. Always consult with your doctor or pharmacist about drug interactions.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1E1C',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0F1E1C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#A0AEC0',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A2E2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    introCard: {
        backgroundColor: '#1A2E2A',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    introTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    introDescription: {
        fontSize: 16,
        color: '#A0AEC0',
        lineHeight: 22,
        marginBottom: 20,
    },
    safeContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    safeText: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10D9A5',
    },
    warningSummary: {
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#2D3748',
    },
    warningCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F59E0B',
    },
    interactionList: {
        gap: 24,
    },
    severitySection: {
        backgroundColor: '#1A2E2A',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    severityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    severityTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    interactionCard: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#2D3748',
    },
    drugChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    drugChip: {
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(16, 217, 165, 0.2)',
    },
    drugChipText: {
        color: '#10D9A5',
        fontSize: 12,
        fontWeight: 'bold',
    },
    interactionDescription: {
        fontSize: 15,
        color: '#FFFFFF',
        lineHeight: 22,
        marginBottom: 16,
    },
    learnMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0F1E1C',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    learnMoreText: {
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: '600',
    },
    disclaimerCard: {
        flexDirection: 'row',
        marginTop: 32,
        padding: 16,
        backgroundColor: 'rgba(160, 174, 192, 0.05)',
        borderRadius: 12,
        gap: 12,
        alignItems: 'center',
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#718096',
        fontStyle: 'italic',
    },
});
