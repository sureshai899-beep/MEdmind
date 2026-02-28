import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { cn } from "../../utils";

export interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    className,
    testID,
}) => {
    const baseStyles = "rounded-xl items-center justify-center flex-row";

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
        primary: "bg-primary",
        secondary: "bg-background-tertiary",
        outline: "border-2 border-primary bg-transparent",
        ghost: "bg-transparent",
        danger: "bg-status-missed",
    };

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
        sm: "px-md py-xs",
        md: "px-lg py-sm",
        lg: "px-xl py-md",
    };

    const textVariantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
        primary: "text-background-primary font-bold",
        secondary: "text-text-primary font-semibold",
        outline: "text-primary font-semibold",
        ghost: "text-primary font-semibold",
        danger: "text-text-primary font-bold",
    };

    const textSizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            accessibilityRole="button"
            accessibilityLabel={typeof children === 'string' ? children : 'Button'}
            accessibilityState={{ disabled: disabled || loading }}
            className={cn(
                baseStyles,
                variantStyles[variant as NonNullable<ButtonProps["variant"]>],
                sizeStyles[size as NonNullable<ButtonProps["size"]>],
                (disabled || loading) && "opacity-50",
                className
            )}
            testID={testID}
        >
            {loading ? (
                <ActivityIndicator color={variant === "primary" ? "#0F1E1C" : "#10D9A5"} />
            ) : (
                <Text className={cn(textVariantStyles[variant as NonNullable<ButtonProps["variant"]>], textSizeStyles[size as NonNullable<ButtonProps["size"]>])}>
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
};
