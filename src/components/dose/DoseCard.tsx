import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface DoseCardProps {
    medicationName: string;
    dosage: string;
    instructions?: string;
    status: "taken" | "next" | "missed" | "pending";
    icon?: React.ReactNode;
    onUndo?: () => void;
    onSnooze?: () => void;
    onTake?: () => void;
    className?: string;
}

export const DoseCard: React.FC<DoseCardProps> = ({
    medicationName,
    dosage,
    instructions,
    status,
    icon,
    onUndo,
    onSnooze,
    onTake,
    className,
}) => {
    const statusConfig = {
        taken: {
            bg: "bg-primary/20",
            border: "border-primary",
            iconBg: "bg-primary",
            statusIcon: "✓",
            statusText: "Taken",
            statusColor: "text-primary",
        },
        next: {
            bg: "bg-primary/20",
            border: "border-status-next",
            iconBg: "bg-primary/20",
            statusIcon: "🕐",
            statusText: "Next",
            statusColor: "text-status-next",
        },
        missed: {
            bg: "bg-primary/20",
            border: "border-status-missed",
            iconBg: "bg-primary/20",
            statusIcon: "⚠",
            statusText: "Missed",
            statusColor: "text-status-missed",
        },
        pending: {
            bg: "bg-primary/20",
            border: "border-ui-border",
            iconBg: "bg-primary",
            statusIcon: "",
            statusText: "",
            statusColor: "",
        },
    };

    const config = statusConfig[status];

    return (
        <View
            className={cn(
                "rounded-2xl p-4 mb-3 border-l-4",
                config.bg,
                config.border,
                className
            )}
        >
            <View className="flex-row items-start">
                {/* Icon */}
                <View
                    className={cn(
                        "w-12 h-12 rounded-xl items-center justify-center mr-3",
                        config.iconBg
                    )}
                >
                    <Text className="text-text-primary text-2xl">{icon || "💊"}</Text>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <Text className="text-text-primary text-base font-bold mb-1">
                        {medicationName}
                    </Text>
                    <Text className="text-text-secondary text-sm mb-1">{dosage}</Text>
                    {instructions && (
                        <Text className="text-text-tertiary text-xs">{instructions}</Text>
                    )}

                    {/* Status */}
                    {config.statusText && (
                        <View className="flex-row items-center mt-2">
                            <Text className={cn("text-sm font-semibold", config.statusColor)}>
                                {config.statusIcon} {config.statusText}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Action Buttons */}
            {status === "taken" && onUndo && (
                <TouchableOpacity
                    onPress={onUndo}
                    className="mt-3 py-2 bg-ui-border rounded-xl items-center"
                >
                    <Text className="text-text-primary text-sm font-semibold">Undo</Text>
                </TouchableOpacity>
            )}

            {status === "next" && (onSnooze || onTake) && (
                <View className="flex-row gap-2 mt-3">
                    {onSnooze && (
                        <TouchableOpacity
                            onPress={onSnooze}
                            className="flex-1 py-3 bg-ui-border rounded-xl items-center"
                        >
                            <Text className="text-text-primary text-sm font-bold">Snooze</Text>
                        </TouchableOpacity>
                    )}
                    {onTake && (
                        <TouchableOpacity
                            onPress={onTake}
                            className="flex-1 py-3 bg-primary rounded-xl items-center"
                        >
                            <Text className="text-black text-sm font-bold">Take</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};
