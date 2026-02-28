import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ConfirmationDialogHeaderProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
    variant?: "danger" | "warning" | "info";
    className?: string;
}

export const ConfirmationDialogHeader: React.FC<ConfirmationDialogHeaderProps> = ({
    title,
    message,
    icon,
    variant = "danger",
    className,
}) => {
    const variantStyles = {
        danger: {
            bg: "bg-[#8B2E2E]",
            iconBg: "bg-status-missed/30",
        },
        warning: {
            bg: "bg-[#8B6E2E]",
            iconBg: "bg-status-next/30",
        },
        info: {
            bg: "bg-[#2E4A8B]",
            iconBg: "bg-[#3B82F6]/30",
        },
    };

    const styles = variantStyles[variant];

    return (
        <View className={cn("rounded-t-3xl p-6", styles.bg, className)}>
            {/* Icon */}
            {icon && (
                <View className="items-center mb-4">
                    <View
                        className={cn(
                            "w-16 h-16 rounded-full items-center justify-center",
                            styles.iconBg
                        )}
                    >
                        {icon}
                    </View>
                </View>
            )}

            {/* Title */}
            <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                {title}
            </Text>

            {/* Message */}
            <Text className="text-text-primary/80 text-base text-center">
                {message}
            </Text>
        </View>
    );
};
