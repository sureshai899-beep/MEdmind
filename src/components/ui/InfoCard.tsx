import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface InfoCardProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    iconBg?: string;
    variant?: "default" | "dark";
    className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
    title,
    subtitle,
    icon,
    iconBg = "#1A2E2A",
    variant = "default",
    className,
}) => {
    const variantStyles = {
        default: "bg-background-secondary border-ui-border",
        dark: "bg-background-primary border-ui-border",
    };

    return (
        <View
            className={cn(
                "rounded-2xl p-4 border mb-4",
                variantStyles[variant],
                className
            )}
        >
            {icon && (
                <View className="flex-row items-center mb-2">
                    <View
                        style={{ backgroundColor: iconBg }}
                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    >
                        {icon}
                    </View>
                </View>
            )}

            <Text className="text-text-primary text-base font-bold mb-1">{title}</Text>

            {subtitle && (
                <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <Text className="text-text-secondary text-sm">{subtitle}</Text>
                </View>
            )}
        </View>
    );
};
