import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AdherenceChart, Icon, ReportGenerationModal } from '../../components';
import { CalendarHeatmap } from '../../components/chart/CalendarHeatmap';
import { QuickStats, MedicationBreakdown, PeriodSelector, TimePeriod } from '../../components/analytics';
import { useDoses } from '../../hooks/useDoses';
import { useMedications } from '../../hooks/useMedications';
import { historyExportService } from '../../services/historyExportService';
import { colors } from '../../constants/Colors';

export function AnalyticsScreen() {
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30');
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const { calculateAdherence, getDoseHistory } = useDoses();
    const { medications } = useMedications();

    const days = selectedPeriod === 'all' ? 365 : parseInt(selectedPeriod, 10);
    const adherence = calculateAdherence(days);
    const doseHistory = getDoseHistory(days);

    const totalDoses = doseHistory.length;
    const takenDoses = doseHistory.filter(d => d.status === 'taken').length;
    const missedDoses = doseHistory.filter(d => d.status === 'missed').length;

    const calculateStreak = () => {
        let streak = 0;
        const sortedHistory = [...doseHistory].sort((a, b) =>
            new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
        );

        for (const dose of sortedHistory) {
            if (dose.status === 'taken') streak++;
            else if (dose.status === 'missed') break;
        }
        return streak;
    };

    const currentStreak = calculateStreak();

    const medicationAdherence = medications.map(med => {
        const medDoses = doseHistory.filter(d => d.medicationId === med.id);
        const medTaken = medDoses.filter(d => d.status === 'taken').length;
        return {
            name: med.name,
            adherence: medDoses.length > 0 ? Math.round((medTaken / medDoses.length) * 100) : 0,
            total: medDoses.length,
            taken: medTaken,
        };
    }).filter(m => m.total > 0);

    const generateChartData = () => {
        const data = [];
        const now = new Date();
        const displayDays = Math.min(days, 7);
        for (let i = displayDays - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const dateString = date.toLocaleDateString();
            const dayDoses = doseHistory.filter(d => new Date(d.scheduledTime).toLocaleDateString() === dateString);
            const dayTaken = dayDoses.filter(d => d.status === 'taken').length;
            data.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                percentage: dayDoses.length > 0 ? Math.round((dayTaken / dayDoses.length) * 100) : 0,
                isCurrent: i === 0
            });
        }
        return data;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analytics</Text>
                <TouchableOpacity onPress={() => setIsExportModalVisible(true)} style={styles.backButton}>
                    <Icon name="share" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

                <QuickStats
                    adherence={adherence}
                    streak={currentStreak}
                    taken={takenDoses}
                    missed={missedDoses}
                />

                <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>Adherence Trend</Text>
                    <AdherenceChart data={generateChartData()} />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                    <CalendarHeatmap
                        month="January"
                        year={2026}
                        data={Array.from({ length: 31 }, (_, i) => ({
                            day: i + 1,
                            level: (i % 5 === 0 ? 1 : i % 3 === 0 ? 2 : 3) as any
                        }))}
                    />
                </Animated.View>

                <MedicationBreakdown data={medicationAdherence} />

                <View style={{ height: 40 }} />
            </ScrollView>

            <ReportGenerationModal
                visible={isExportModalVisible}
                onClose={() => setIsExportModalVisible(false)}
                onGenerate={({ startDate, endDate, format }) => {
                    setIsExportModalVisible(false);
                    if (format === 'pdf') {
                        historyExportService.exportToPDF(doseHistory, "User Name", { startDate, endDate });
                    } else {
                        historyExportService.exportToCSV(doseHistory);
                    }
                }}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
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
        backgroundColor: colors.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.text.primary,
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    chartContainer: {
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
