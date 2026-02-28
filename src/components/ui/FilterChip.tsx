import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface FilterChipProps {
    label: string;
    icon?: string;
    active?: boolean;
    onPress?: () => void;
    className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
    label,
    icon,
    active = false,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                "flex-row items-center px-4 py-2.5 rounded-full border",
                active
                    ? "bg-primary border-primary"
                    : "bg-transparent border-ui-border",
                className
            )}
        >
            {icon && (
                <Text className={cn("mr-2", active ? "text-background-primary" : "text-primary")}>
                    {icon}
                </Text>
            )}
            <Text
                className={cn(
                    "font-semibold text-sm",
                    active ? "text-background-primary" : "text-text-primary"
                )}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};
