import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SuccessScreenProps {
    icon?: React.ReactNode;
    iconBg?: string;
    title: string;
    message: string;
    primaryAction?: {
        label: string;
        onPress: () => void;
    };
    secondaryAction?: {
        label: string;
        onPress: () => void;
    };
    className?: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
    icon,
    iconBg = "#1A3D2E",
    title,
    message,
    primaryAction,
    secondaryAction,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-1 bg-background-primary items-center justify-center px-6",
                className
            )}
        >
            {/* Icon */}
            {icon && (
                <View
                    style={{ backgroundColor: iconBg }}
                    className="w-24 h-24 rounded-full items-center justify-center mb-8"
                >
                    {icon}
                </View>
            )}

            {/* Title */}
            <Text className="text-text-primary text-3xl font-bold text-center mb-4">
                {title}
            </Text>

            {/* Message */}
            <Text className="text-text-secondary text-base text-center mb-8 px-4">
                {message}
            </Text>

            {/* Actions */}
            <View className="w-full">
                {primaryAction && (
                    <TouchableOpacity
                        onPress={primaryAction.onPress}
                        className="bg-primary rounded-2xl py-4 mb-4"
                    >
                        <Text className="text-black text-base font-bold text-center">
                            {primaryAction.label}
                        </Text>
                    </TouchableOpacity>
                )}

                {secondaryAction && (
                    <TouchableOpacity
                        onPress={secondaryAction.onPress}
                        className="py-3"
                    >
                        <Text className="text-primary text-base font-semibold text-center">
                            {secondaryAction.label}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
