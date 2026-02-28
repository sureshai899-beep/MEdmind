import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return <View className={cn("mb-3", className)}>{children}</View>;
};

export interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
    return (
        <Text className={cn("text-white text-lg font-bold", className)}>
            {children}
        </Text>
    );
};

export interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return <View className={cn("", className)}>{children}</View>;
};

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "dark" | "outlined";
    testID?: string;
}

export const Card: React.FC<CardProps> & {
    Header: typeof CardHeader;
    Title: typeof CardTitle;
    Content: typeof CardContent;
} = ({
    children,
    className,
    variant = "default",
    testID,
}) => {
        const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
            default: "bg-background-tertiary",
            dark: "bg-background-secondary",
            outlined: "bg-transparent border border-ui-border",
        };

        return (
            <View
                testID={testID}
                className={cn(
                    "rounded-2xl p-4",
                    variantStyles[variant as NonNullable<CardProps["variant"]>],
                    className
                )}
            >
                {children}
            </View>
        );
    };

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
