import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface MedicationListItemProps {
    name: string;
    dosage: string;
    schedule?: string;
    nextDose?: string;
    nextDoseTime?: string;
    icon?: string;
    iconBg?: string;
    statusBadge?: React.ReactNode;
    onPress?: () => void;
    className?: string;
}

export const MedicationListItem: React.FC<MedicationListItemProps> = ({
    name,
    dosage,
    schedule,
    nextDose,
    nextDoseTime,
    icon = "💊",
    iconBg = "#1E7A6D",
    statusBadge,
    onPress,
    className,
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            className={cn(
                "bg-background-secondary rounded-2xl p-4 mb-3 flex-row items-center",
                onPress && "active:opacity-70",
                className
            )}
        >
            {/* Icon */}
            <View
                style={{ backgroundColor: iconBg }}
                className="w-14 h-14 rounded-2xl items-center justify-center mr-3"
            >
                <Text className="text-2xl">{icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold mb-1">{name}</Text>
                <Text className="text-text-secondary text-sm">{dosage}</Text>
                {schedule && (
                    <Text className="text-text-tertiary text-xs mt-1">{schedule}</Text>
                )}
            </View>

            {/* Right Side - Next Dose Info or Badge */}
            {nextDose && nextDoseTime ? (
                <View className="items-end">
                    <Text className="text-primary text-sm font-semibold mb-1">
                        {nextDose}
                    </Text>
                    <Text className="text-text-tertiary text-xs">{nextDoseTime}</Text>
                </View>
            ) : statusBadge ? (
                <View>{statusBadge}</View>
            ) : null}
        </Container>
    );
};
