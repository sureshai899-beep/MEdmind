import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ToastProps {
    message: string;
    subtitle?: string;
    type?: "success" | "info" | "warning" | "error";
    icon?: string;
    onClose?: () => void;
    className?: string;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    subtitle,
    type = "success",
    icon,
    onClose,
    className,
}) => {
    const typeConfig = {
        success: {
            bg: "bg-primary/20",
            border: "border-primary",
            icon: icon || "✓",
            iconBg: "bg-primary",
        },
        info: {
            bg: "bg-[#1A2E3D]",
            border: "border-[#3B82F6]",
            icon: icon || "ℹ",
            iconBg: "bg-[#3B82F6]",
        },
        warning: {
            bg: "bg-status-next/20",
            border: "border-status-next",
            icon: icon || "⚠",
            iconBg: "bg-status-next",
        },
        error: {
            bg: "bg-status-missed/20",
            border: "border-status-missed",
            icon: icon || "✕",
            iconBg: "bg-status-missed",
        },
    };

    const config = typeConfig[type];

    return (
        <View
            className={cn(
                "flex-row items-center rounded-2xl p-4 border-l-4 mb-3",
                config.bg,
                config.border,
                className
            )}
        >
            {/* Icon */}
            <View
                className={cn(
                    "w-10 h-10 rounded-full items-center justify-center mr-3",
                    config.iconBg
                )}
            >
                <Text className="text-text-primary text-lg font-bold">{config.icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-semibold">{message}</Text>
                {subtitle && (
                    <Text className="text-text-secondary text-sm mt-1">{subtitle}</Text>
                )}
            </View>

            {/* Close Button */}
            {onClose && (
                <TouchableOpacity onPress={onClose} className="ml-3">
                    <Text className="text-text-tertiary text-xl">✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
