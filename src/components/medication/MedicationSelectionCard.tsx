import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface MedicationSelectionCardProps {
    name: string;
    dosage: string;
    nextDose: string;
    icon: string;
    selected: boolean;
    onToggle: () => void;
    statusBadge?: React.ReactNode;
    className?: string;
}

export const MedicationSelectionCard: React.FC<MedicationSelectionCardProps> = ({
    name,
    dosage,
    nextDose,
    icon,
    selected,
    onToggle,
    statusBadge,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            className={cn(
                "bg-[#1A2E2C] border border-transparent rounded-[24px] p-5 flex-row items-center mb-4 transition-all",
                selected && "border-primary bg-[#1A2E2C]/80",
                className
            )}
        >
            {/* Selection Circle */}
            <View
                className={cn(
                    "w-7 h-7 rounded-full border-2 border-ui-border items-center justify-center mr-5",
                    selected && "border-primary bg-primary"
                )}
            >
                {selected && <Text className="text-black text-[10px] font-bold">✓</Text>}
            </View>

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

            {statusBadge && <View>{statusBadge}</View>}
        </TouchableOpacity>
    );
};
