import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface AlertBannerProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
    type?: "warning" | "info" | "success" | "error";
    onClose?: () => void;
    className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
    title,
    message,
    icon,
    type = "warning",
    onClose,
    className,
}) => {
    const typeConfig = {
        warning: {
            bg: "bg-status-next/20",
            border: "border-status-next",
            iconBg: "bg-status-next",
            titleColor: "text-status-next",
            defaultIcon: "⚠",
        },
        info: {
            bg: "bg-[#1A2E3D]",
            border: "border-[#3B82F6]",
            iconBg: "bg-[#3B82F6]",
            titleColor: "text-[#3B82F6]",
            defaultIcon: "ℹ",
        },
        success: {
            bg: "bg-primary/20",
            border: "border-primary",
            iconBg: "bg-primary",
            titleColor: "text-primary",
            defaultIcon: "✓",
        },
        error: {
            bg: "bg-status-missed/20",
            border: "border-status-missed",
            iconBg: "bg-status-missed",
            titleColor: "text-status-missed",
            defaultIcon: "✕",
        },
    };

    const config = typeConfig[type];

    return (
        <View
            className={cn(
                "rounded-2xl p-4 border-l-4 mb-3",
                config.bg,
                config.border,
                className
            )}
        >
            <View className="flex-row items-start">
                {/* Icon */}
                <View
                    className={cn(
                        "w-10 h-10 rounded-full items-center justify-center mr-3",
                        config.iconBg
                    )}
                >
                    <Text className="text-text-primary text-lg font-bold">
                        {icon || config.defaultIcon}
                    </Text>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <Text className={cn("text-base font-bold mb-1", config.titleColor)}>
                        {title}
                    </Text>
                    <Text className="text-text-secondary text-sm">{message}</Text>
                </View>

                {/* Close Button */}
                {onClose && (
                    <TouchableOpacity onPress={onClose} className="ml-3">
                        <Text className="text-text-tertiary text-xl">✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
