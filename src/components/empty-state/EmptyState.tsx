import React from "react";
import { View, Text } from "react-native";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { colors } from "../../constants/Colors";
import { cn } from "../../utils";

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = <Icon name="pill" size={64} color={colors.primary.DEFAULT} />,
    title,
    description,
    actionLabel,
    onAction,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-1 items-center justify-center px-8",
                className
            )}
        >
            {/* Icon Circle */}
            <View className="w-32 h-32 bg-[#1A4D45]/40 rounded-full items-center justify-center mb-6">
                {typeof icon === 'string' ? (
                    <Text className="text-6xl">{icon}</Text>
                ) : (
                    icon
                )}
            </View>

            {/* Title */}
            <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                {title}
            </Text>

            {/* Description */}
            {description && (
                <Text className="text-text-secondary text-base text-center mb-8 leading-6">
                    {description}
                </Text>
            )}

            {/* Action Button */}
            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    size="lg"
                    onPress={onAction}
                    className="w-full max-w-sm"
                >
                    {actionLabel}
                </Button>
            )}
        </View>
    );
};
