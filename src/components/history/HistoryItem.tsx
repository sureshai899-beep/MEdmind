import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface HistoryItemProps {
    time: string;
    status: "taken" | "missed" | "snoozed";
    notes?: string;
    hasNoteIcon?: boolean;
    className?: string;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
    time,
    status,
    notes,
    hasNoteIcon = false,
    className,
}) => {
    const statusConfig = {
        taken: {
            bg: "bg-primary",
            icon: "✓",
            label: "Taken",
        },
        missed: {
            bg: "bg-status-missed",
            icon: "✕",
            label: "Missed",
        },
        snoozed: {
            bg: "bg-status-next",
            icon: "⏰",
            label: "Snoozed",
        },
    };

    const config = statusConfig[status];

    return (
        <View className={cn("flex-row items-start py-4", className)}>
            {/* Status Icon */}
            <View
                className={cn(
                    "w-10 h-10 rounded-full items-center justify-center mr-4",
                    config.bg
                )}
            >
                <Text className="text-text-primary text-lg">{config.icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold mb-1">
                    {config.label} at {time}
                </Text>
                {notes && (
                    <Text className="text-text-secondary text-sm">{notes}</Text>
                )}
            </View>

            {/* Note Icon */}
            {hasNoteIcon && (
                <View className="ml-2">
                    <Text className="text-text-tertiary text-xl">📄</Text>
                </View>
            )}
        </View>
    );
};
