import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../../../../constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Icon } from "../../../../components/ui/Icon";
import { StyleSheet } from "react-native";
import { notificationService } from "../../../../services/notificationService";

export function NotificationsScreen() {
    const router = useRouter();
    const [medReminders, setMedReminders] = useState(true);
    const [refillAlerts, setRefillAlerts] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);
    const [newsUpdates, setNewsUpdates] = useState(false);

    interface NotificationItemProps {
        label: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    }

    const NotificationItem = ({ label, value, onValueChange }: NotificationItemProps) => (
        <View className="flex-row items-center justify-between p-4 bg-background-secondary rounded-2xl mb-3 border border-ui-border">
            <Text className="text-text-primary text-base font-medium">{label}</Text>
            <Switch
                trackColor={{ false: colors.ui.border, true: colors.primary.DEFAULT }}
                thumbColor={value ? colors.text.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center p-4 mt-2">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Text className="text-primary text-lg">← Back</Text>
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-4">Notifications</Text>
            </View>

            <ScrollView className="flex-1 px-6 mt-2">
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                    <Text className="text-text-tertiary text-xs font-bold uppercase mb-4 px-2">
                        Alerts & Reminders
                    </Text>
                    <NotificationItem
                        label="Medication Reminders"
                        value={medReminders}
                        onValueChange={setMedReminders}
                    />
                    <NotificationItem
                        label="Refill Alerts"
                        value={refillAlerts}
                        onValueChange={setRefillAlerts}
                    />

                    <Text style={styles.sectionHeader}>
                        General
                    </Text>
                    <NotificationItem
                        label="Weekly Health Summary"
                        value={weeklySummary}
                        onValueChange={setWeeklySummary}
                    />
                    <NotificationItem
                        label="App News & Updates"
                        value={newsUpdates}
                        onValueChange={setNewsUpdates}
                    />

                    <Text style={styles.sectionHeader}>
                        Notification Sounds
                    </Text>
                    <View style={styles.tuningCard}>
                        <View style={styles.tuningRow}>
                            <View>
                                <Text style={styles.tuningLabel}>Critical Meds</Text>
                                <Text style={styles.tuningSub}>Life-saving medications</Text>
                            </View>
                            <TouchableOpacity style={styles.soundButton}>
                                <Text style={styles.soundText}>Emergency Siren</Text>
                                <Icon name="chevron-forward" size={16} color={colors.primary.DEFAULT} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tuningRow}>
                            <View>
                                <Text style={styles.tuningLabel}>Daily Supplements</Text>
                                <Text style={styles.tuningSub}>General wellness</Text>
                            </View>
                            <TouchableOpacity style={styles.soundButton}>
                                <Text style={styles.soundText}>Soft Chime</Text>
                                <Icon name="chevron-forward" size={16} color={colors.primary.DEFAULT} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="mt-8 bg-primary/10 border border-primary/20 py-4 rounded-2xl items-center"
                        onPress={async () => {
                            await notificationService.testNotification();
                        }}
                    >
                        <Text className="text-primary font-bold">Send Test Notification</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    sectionHeader: {
        color: colors.text.tertiary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    tuningCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.ui.border,
        overflow: 'hidden',
    },
    tuningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.border,
    },
    tuningLabel: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    tuningSub: {
        color: colors.text.tertiary,
        fontSize: 12,
        marginTop: 2,
    },
    soundButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.primary.DEFAULT}1A`, // 10% opacity
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    soundText: {
        color: colors.primary.DEFAULT,
        fontSize: 14,
        fontWeight: '600',
    },
});
