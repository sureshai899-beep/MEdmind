import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SortOptionProps {
    label: string;
    isSelected?: boolean;
    sortDirection?: "asc" | "desc" | null;
    onPress?: () => void;
    className?: string;
}

export const SortOption: React.FC<SortOptionProps> = ({
    label,
    isSelected = false,
    sortDirection = null,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center justify-between py-4 rounded-xl px-4 mb-2",
                isSelected ? "bg-primary/20" : "bg-transparent",
                className
            )}
        >
            <Text
                className={cn(
                    "text-base",
                    isSelected ? "text-primary" : "text-white"
                )}
            >
                {label}
            </Text>

            {sortDirection && (
                <Text className="text-text-tertiary text-lg">
                    {sortDirection === "asc" ? "↓" : "↑"}
                </Text>
            )}
        </TouchableOpacity>
    );
};
