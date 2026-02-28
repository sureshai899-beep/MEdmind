import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface SyncStateCardProps {
    state: "required" | "syncing" | "up-to-date" | "failed";
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const SyncStateCard: React.FC<SyncStateCardProps> = ({
    state,
    title,
    message,
    icon,
    className,
}) => {
    const stateConfig = {
        required: {
            icon: "⚠️",
            title: "Sync Required",
            message: "Your device contains changes that need to be synced.",
            iconBg: "bg-status-next/20",
        },
        syncing: {
            icon: "🔄",
            title: "Syncing...",
            message: "Please wait while we sync your data.",
            iconBg: "bg-[#1A3D5C]",
        },
        "up-to-date": {
            icon: "☁️",
            title: "Up to Date",
            message: "All your data is synced and up to date.",
            iconBg: "bg-primary/20",
        },
        failed: {
            icon: "🚫",
            title: "Sync Failed",
            message: "We couldn't sync your data. Please try again or check your connection.",
            iconBg: "bg-status-missed/20",
        },
    };

    const config = stateConfig[state];

    return (
        <View className={cn("items-center justify-center px-6", className)}>
            {/* Icon */}
            <View
                className={cn(
                    "w-24 h-24 rounded-full items-center justify-center mb-6",
                    config.iconBg
                )}
            >
                <Text className="text-5xl">{icon || config.icon}</Text>
            </View>

            {/* Title */}
            <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                {title || config.title}
            </Text>

            {/* Message */}
            <Text className="text-text-secondary text-base text-center">
                {message || config.message}
            </Text>
        </View>
    );
};
