import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface DataManagementItemProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    iconBg?: string;
    variant?: "default" | "danger";
    onPress?: () => void;
    className?: string;
}

export const DataManagementItem: React.FC<DataManagementItemProps> = ({
    title,
    description,
    icon,
    iconBg = "#2D3748",
    variant = "default",
    onPress,
    className,
}) => {
    const variantStyles = {
        default: {
            titleColor: "text-white",
        },
        danger: {
            titleColor: "text-status-missed",
        },
    };

    const styles = variantStyles[variant];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center py-4 border-b border-ui-border",
                className
            )}
        >
            {/* Icon */}
            {icon && (
                <View
                    style={{ backgroundColor: iconBg }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                >
                    {icon}
                </View>
            )}

            {/* Content */}
            <View className="flex-1">
                <Text className={cn("text-base font-semibold mb-1", styles.titleColor)}>
                    {title}
                </Text>
                <Text className="text-text-tertiary text-sm">{description}</Text>
            </View>

            {/* Chevron */}
            <Text className="text-text-tertiary text-xl ml-2">›</Text>
        </TouchableOpacity>
    );
};
