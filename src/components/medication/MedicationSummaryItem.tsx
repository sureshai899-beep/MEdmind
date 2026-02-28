import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface MedicationSummaryItemProps {
    name: string;
    dosage: string;
    nextDose: string;
    icon: string;
    status: "completed" | "pending";
    onPress?: () => void;
    className?: string;
}

export const MedicationSummaryItem: React.FC<MedicationSummaryItemProps> = ({
    name,
    dosage,
    nextDose,
    icon,
    status,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "bg-background-secondary border border-ui-border rounded-[24px] p-5 flex-row items-center mb-4",
                className
            )}
        >
            <View className="w-12 h-12 bg-background-primary rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">{icon}</Text>
            </View>

            <View className="flex-1">
                <Text className="text-text-primary text-lg font-bold mb-1">{name}</Text>
                <Text className="text-text-secondary text-sm mb-2">{dosage}</Text>
                <View className="flex-row items-center">
                    <Text className="text-text-secondary text-xs mr-2">🕒</Text>
                    <Text className="text-text-secondary text-xs font-medium">
                        Next: {nextDose}
                    </Text>
                </View>
            </View>

            <View>
                {status === "completed" ? (
                    <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center border border-primary">
                        <Text className="text-primary text-sm">✓</Text>
                    </View>
                ) : (
                    <View className="w-8 h-8 items-center justify-center">
                        <Text className="text-text-tertiary text-xl">•••</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};
