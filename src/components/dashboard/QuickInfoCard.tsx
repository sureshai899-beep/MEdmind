import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface QuickInfoCardProps {
    title: string;
    subtitle: string;
    variant?: "default" | "dark";
    className?: string;
}

export const QuickInfoCard: React.FC<QuickInfoCardProps> = ({
    title,
    subtitle,
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
                "rounded-2xl p-md border",
                variantStyles[variant],
                className
            )}
        >
            <Text className="text-text-primary text-h3 mb-xs">{title}</Text>
            <Text className="text-text-tertiary text-body-sm font-medium">{subtitle}</Text>
        </View>
    );
};
