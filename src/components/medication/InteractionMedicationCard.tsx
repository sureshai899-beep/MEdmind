import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface InteractionMedicationCardProps {
    name: string;
    type: string;
    icon?: string;
    variant?: "primary" | "secondary";
    className?: string;
}

export const InteractionMedicationCard: React.FC<InteractionMedicationCardProps> = ({
    name,
    type,
    icon = "💊",
    variant = "primary",
    className,
}) => {
    return (
        <View
            className={cn(
                "w-full flex-row items-center p-4 rounded-2xl border border-ui-border/30 bg-[#1A2E2C]/40 mb-3",
                className
            )}
        >
            <View
                className={cn(
                    "w-12 h-12 rounded-full items-center justify-center mr-4",
                    variant === "primary" ? "bg-[#1B2F4A]" : "bg-[#33231F]"
                )}
            >
                <Text className="text-xl">{icon}</Text>
            </View>
            <View>
                <Text className="text-text-primary text-lg font-bold">{name}</Text>
                <Text className="text-text-tertiary text-sm uppercase tracking-wider">
                    {type}
                </Text>
            </View>
        </View>
    );
};
