import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface StatusBadgeProps {
    status: "taken" | "next" | "missed" | "pending" | "warning";
    size?: "sm" | "md";
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    size = "md",
    className,
}) => {
    const statusConfig: Record<StatusBadgeProps["status"], { bg: string; text: string; icon: string }> = {
        taken: {
            bg: "bg-status-taken",
            text: "Taken",
            icon: "✓",
        },
        next: {
            bg: "bg-status-next",
            text: "Next",
            icon: "⋯",
        },
        missed: {
            bg: "bg-status-missed",
            text: "Missed",
            icon: "✕",
        },
        pending: {
            bg: "bg-text-tertiary",
            text: "Pending",
            icon: "○",
        },
        warning: {
            bg: "bg-status-warning",
            text: "Warning",
            icon: "⚠",
        },
    };

    const config = statusConfig[status];
    const sizeClasses = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
    const textSize = size === "sm" ? "text-xs" : "text-sm";

    return (
        <View
            className={cn(
                "flex-row items-center rounded-full",
                config.bg,
                sizeClasses,
                className
            )}
        >
            <Text className={cn("text-white font-semibold mr-1", textSize)}>
                {config.icon}
            </Text>
            <Text className={cn("text-white font-semibold", textSize)}>
                {config.text}
            </Text>
        </View>
    );
};
