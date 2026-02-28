import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Icon } from "../ui/Icon";
import { cn } from "../../utils";
import { colors } from "../../constants/Colors";

export interface MedicationCardProps {
    name: string;
    dosage: string;
    time?: string;
    status: "taken" | "next" | "missed" | "pending";
    icon?: string;
    onTake?: () => void;
    onSnooze?: () => void;
    onSkip?: () => void;
    onUndo?: () => void;
    className?: string;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
    name,
    dosage,
    time,
    status,
    icon = "💊",
    onTake,
    onSnooze,
    onSkip,
    onUndo,
    className,
}) => {
    const handleSkip = () => {
        Alert.alert(
            "Skip Medication",
            "Are you sure you want to skip this dose?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Skip", style: "destructive", onPress: onSkip }
            ]
        );
    };
    const statusConfig: Record<string, { bg: string; badge: string; badgeText: string; showUndo?: boolean; showActions?: boolean }> = {
        taken: {
            bg: "bg-background-tertiary",
            badge: "bg-primary",
            badgeText: "Taken",
            showUndo: true,
        },
        next: {
            bg: "bg-background-tertiary",
            badge: "bg-status-next",
            badgeText: "Next",
            showActions: true,
        },
        missed: {
            bg: "bg-status-missed/20",
            badge: "bg-status-missed",
            badgeText: "Missed",
            showActions: false,
        },
        pending: {
            bg: "bg-background-tertiary",
            badge: "bg-text-tertiary",
            badgeText: "Pending",
            showActions: false,
        },
    };

    const config = statusConfig[status];

    const renderRightActions = () => {
        if (!config.showActions) return null;
        return (
            <View style={styles.rightActions}>
                <TouchableOpacity
                    onPress={onSnooze}
                    style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                >
                    <Icon name="time" size={24} color="#FFFFFF" />
                    <Text style={styles.actionText}>Snooze</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSkip}
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                >
                    <Icon name="close-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.actionText}>Skip</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderLeftActions = () => {
        if (!config.showActions) return null;
        return (
            <View style={styles.leftActions}>
                <TouchableOpacity
                    onPress={onTake}
                    style={[styles.actionButton, { backgroundColor: '#10D9A5' }]}
                >
                    <Icon name="checkmark-circle" size={24} color="#0F1E1C" />
                    <Text style={[styles.actionText, { color: '#0F1E1C' }]}>Take</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const CardContent = (
        <View className={cn("rounded-2xl p-md mb-md", config.bg, className)}>
            <View className="flex-row items-center justify-between mb-md">
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-primary rounded-xl items-center justify-center mr-md">
                        <Text className="text-2xl">{icon}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-text-primary text-body-lg font-bold">{name}</Text>
                        <Text className="text-text-secondary text-body-sm">{dosage}</Text>
                    </View>
                </View>
                <View className={cn("px-md py-xs rounded-full", config.badge)}>
                    <Text className="text-text-primary text-caption font-semibold uppercase tracking-wider">
                        {config.badgeText}
                    </Text>
                </View>
            </View>

            {config.showActions && (
                <View className="flex-row gap-xs">
                    <TouchableOpacity
                        onPress={onSnooze}
                        activeOpacity={0.7}
                        className="flex-1 bg-background-secondary rounded-xl py-md items-center"
                    >
                        <Text className="text-text-primary font-semibold text-xs">Snooze</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSkip}
                        activeOpacity={0.7}
                        className="flex-1 bg-background-secondary rounded-xl py-md items-center mx-1"
                    >
                        <Text className="text-status-missed font-semibold text-xs">Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onTake}
                        activeOpacity={0.8}
                        className="flex-1 bg-primary rounded-xl py-md items-center"
                    >
                        <Text className="text-background-primary font-bold text-xs">Take</Text>
                    </TouchableOpacity>
                </View>
            )}

            {config.showUndo && (
                <TouchableOpacity
                    onPress={onUndo}
                    activeOpacity={0.7}
                    className="bg-background-secondary rounded-xl py-md items-center"
                >
                    <Text className="text-text-primary font-semibold">Undo</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return config.showActions ? (
        <Swipeable
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            friction={2}
            leftThreshold={40}
            rightThreshold={40}
        >
            {CardContent}
        </Swipeable>
    ) : (
        CardContent
    );
};

const styles = StyleSheet.create({
    leftActions: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    rightActions: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    actionButton: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 4,
    },
});
