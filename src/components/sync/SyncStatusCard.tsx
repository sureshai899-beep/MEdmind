import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface SyncStatusCardProps {
    status: "pending" | "syncing" | "synced" | "error";
    title: string;
    message: string;
    lastSynced?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const SyncStatusCard: React.FC<SyncStatusCardProps> = ({
    status,
    title,
    message,
    lastSynced,
    icon,
    className,
}) => {
    const statusConfig = {
        pending: {
            bg: "bg-status-next/20",
            border: "border-status-next",
            iconBg: "bg-status-next",
            defaultIcon: "⏳",
        },
        syncing: {
            bg: "bg-[#1A2E3D]",
            border: "border-[#3B82F6]",
            iconBg: "bg-[#3B82F6]",
            defaultIcon: "🔄",
        },
        synced: {
            bg: "bg-primary/20",
            border: "border-primary",
            iconBg: "bg-primary",
            defaultIcon: "✓",
        },
        error: {
            bg: "bg-status-missed/20",
            border: "border-status-missed",
            iconBg: "bg-status-missed",
            defaultIcon: "✕",
        },
    };

    const config = statusConfig[status];

    return (
        <View
            className={cn(
                "rounded-2xl p-4 border-l-4 mb-4",
                config.bg,
                config.border,
                className
            )}
        >
            <View className="flex-row items-start">
                {/* Icon */}
                <View
                    className={cn(
                        "w-12 h-12 rounded-full items-center justify-center mr-4",
                        config.iconBg
                    )}
                >
                    <Text className="text-text-primary text-xl font-bold">
                        {icon || config.defaultIcon}
                    </Text>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <Text className="text-text-primary text-base font-bold mb-1">{title}</Text>
                    <Text className="text-text-secondary text-sm mb-1">{message}</Text>
                    {lastSynced && (
                        <Text className="text-text-tertiary text-xs">
                            Last synced: {lastSynced}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};
