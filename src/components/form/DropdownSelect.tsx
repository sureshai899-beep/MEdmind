import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface DropdownSelectProps {
    label?: string;
    value: string;
    icon?: React.ReactNode;
    onPress?: () => void;
    variant?: "default" | "dark";
    className?: string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
    label,
    value,
    icon,
    onPress,
    variant = "default",
    className,
}) => {
    const variantStyles = {
        default: "bg-background-secondary border-ui-border",
        dark: "bg-background-primary border-ui-border",
    };

    return (
        <View className={cn("mb-4", className)}>
            {label && (
                <Text className="text-text-secondary text-sm mb-2">{label}</Text>
            )}

            <TouchableOpacity
                onPress={onPress}
                disabled={!onPress}
                className={cn(
                    "flex-row items-center justify-between rounded-xl border px-4 py-3",
                    variantStyles[variant]
                )}
            >
                <View className="flex-row items-center flex-1">
                    {icon && <View className="mr-3">{icon}</View>}
                    <Text className="text-text-primary text-base">{value}</Text>
                </View>

                <Text className="text-text-tertiary text-lg">▼</Text>
            </TouchableOpacity>
        </View>
    );
};
