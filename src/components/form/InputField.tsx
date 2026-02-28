import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { cn } from "../../utils";

export interface InputFieldProps extends Omit<TextInputProps, "className"> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: "default" | "dark";
    className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    variant = "default",
    className,
    ...textInputProps
}) => {
    const variantStyles: Record<NonNullable<InputFieldProps["variant"]>, string> = {
        default: "bg-transparent border-ui-border",
        dark: "bg-background-secondary border-ui-border",
    };

    return (
        <View className={cn("mb-4", className)}>
            {label && (
                <Text className="text-text-secondary text-sm mb-2">{label}</Text>
            )}

            <View
                className={cn(
                    "flex-row items-center rounded-xl border px-4 py-3",
                    variantStyles[variant as NonNullable<InputFieldProps["variant"]>],
                    error && "border-status-missed"
                )}
            >
                {leftIcon && (
                    <View className="mr-3">{leftIcon}</View>
                )}

                <TextInput
                    className="flex-1 text-text-primary text-base"
                    placeholderTextColor="#718096"
                    {...textInputProps}
                />

                {rightIcon && (
                    <View className="ml-3">{rightIcon}</View>
                )}
            </View>

            {error && (
                <Text className="text-status-missed text-xs mt-1">{error}</Text>
            )}
        </View>
    );
};
