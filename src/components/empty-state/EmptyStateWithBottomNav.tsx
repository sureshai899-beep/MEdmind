import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface EmptyStateWithBottomNavProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    className?: string;
}

export const EmptyStateWithBottomNav: React.FC<EmptyStateWithBottomNavProps> = ({
    icon,
    title,
    description,
    primaryAction,
    secondaryAction,
    className,
}) => {
    return (
        <View className={cn("flex-1 items-center justify-center px-6", className)}>
            {/* Icon */}
            {icon && <View className="mb-6">{icon}</View>}

            {/* Title */}
            <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                {title}
            </Text>

            {/* Description */}
            <Text className="text-text-secondary text-base text-center mb-8">
                {description}
            </Text>

            {/* Actions */}
            {primaryAction && <View className="w-full mb-4">{primaryAction}</View>}
            {secondaryAction && <View className="w-full">{secondaryAction}</View>}
        </View>
    );
};
