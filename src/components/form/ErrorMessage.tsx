import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ErrorMessageProps {
    message: string;
    icon?: string;
    variant?: "error" | "warning" | "info";
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    icon = "⚠",
    variant = "error",
    className,
}) => {
    const variantStyles = {
        error: {
            text: "text-status-missed",
            icon: "text-status-missed",
        },
        warning: {
            text: "text-status-next",
            icon: "text-status-next",
        },
        info: {
            text: "text-primary",
            icon: "text-primary",
        },
    };

    const styles = variantStyles[variant];

    return (
        <View className={cn("flex-row items-center mt-2", className)}>
            <Text className={cn("text-base mr-2", styles.icon)}>{icon}</Text>
            <Text className={cn("text-sm flex-1", styles.text)}>{message}</Text>
        </View>
    );
};
