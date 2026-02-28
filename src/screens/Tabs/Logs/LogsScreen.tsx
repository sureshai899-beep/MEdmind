import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, Icon } from '../../../components';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useDoses } from '../../../hooks/useDoses';
import { useAuth } from '../../../hooks/useAuth';
import { historyExportService } from '../../../services/historyExportService';
import { colors } from '../../../constants/Colors';

export function LogsScreen() {
    const router = useRouter();
    const { doses, loading } = useDoses();
    const { user } = useAuth();

    const handleExportPDF = async () => {
        if (doses.length === 0) {
            Alert.alert('No Data', 'There is no history to export yet.');
            return;
        }
        try {
            await historyExportService.exportToPDF(doses, user?.name || 'Pillara User');
        } catch (error) {
            Alert.alert('Export Failed', 'Something went wrong while generating the PDF.');
        }
    };

    const handleExportCSV = async () => {
        if (doses.length === 0) {
            Alert.alert('No Data', 'There is no history to export yet.');
            return;
        }
        try {
            await historyExportService.exportToCSV(doses);
        } catch (error) {
            Alert.alert('Export Failed', 'Something went wrong while generating the CSV.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'taken': return colors.status.taken;
            case 'missed': return colors.status.missed;
            case 'snoozed': return colors.status.snoozed;
            default: return colors.text.tertiary;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="px-4 py-4 flex-1">
                <View className="flex-row justify-between items-center mb-6">
                    <Animated.Text
                        entering={FadeInDown.duration(600)}
                        className="text-text-primary text-3xl font-bold"
                    >
                        Health Logs
                    </Animated.Text>

                    <View className="flex-row space-x-2">
                        <TouchableOpacity
                            testID="export-pdf-button"
                            onPress={handleExportPDF}
                            className="bg-[#1A4D45]/40 p-2 rounded-xl"
                        >
                            <Icon name="mail" size={24} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            testID="export-csv-button"
                            onPress={handleExportCSV}
                            className="bg-[#1A4D45]/40 p-2 rounded-xl"
                        >
                            <Icon name="stats" size={24} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                    </View>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
                    </View>
                ) : doses.length === 0 ? (
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800)}
                        className="flex-1"
                    >
                        <EmptyState
                            icon="📊"
                            title="No Logs Yet"
                            description="Start logging your medication doses to see your history and health trends here."
                            actionLabel="Log Your First Dose"
                            onAction={() => router.push('/(tabs)')}
                        />
                    </Animated.View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    >
                        {doses.sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()).map((dose, index) => (
                            <Animated.View
                                key={dose.id}
                                entering={FadeInUp.delay(index * 50).duration(400)}
                                className="bg-background-secondary p-4 rounded-2xl mb-3 border border-ui-border"
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="text-text-primary text-lg font-bold">
                                            {dose.medicationName}
                                        </Text>
                                        <Text className="text-text-tertiary text-sm mt-1">
                                            {new Date(dose.scheduledTime).toLocaleString()}
                                        </Text>
                                        {dose.notes && (
                                            <Text className="text-text-secondary text-sm mt-2 italic">
                                                "{dose.notes}"
                                            </Text>
                                        )}
                                    </View>
                                    <View
                                        className="px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${getStatusColor(dose.status)}20` }}
                                    >
                                        <Text
                                            className="text-xs font-bold uppercase"
                                            style={{ color: getStatusColor(dose.status) }}
                                        >
                                            {dose.status}
                                        </Text>
                                    </View>
                                </View>
                            </Animated.View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
