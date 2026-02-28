import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ActionSuccessStateProps {
    title: string;
    message: string;
    footerInfo?: string;
    primaryAction: {
        label: string;
        onPress: () => void;
    };
    className?: string;
}

export const ActionSuccessState: React.FC<ActionSuccessStateProps> = ({
    title,
    message,
    footerInfo,
    primaryAction,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-1 bg-background-primary items-center justify-center px-8",
                className
            )}
        >
            {/* Success Icon */}
            <View className="w-32 h-32 bg-primary/20 rounded-full items-center justify-center mb-10">
                <Text className="text-primary text-5xl">task_alt</Text>
            </View>

            {/* Title */}
            <Text className="text-text-primary text-3xl font-bold text-center mb-4">
                {title}
            </Text>

            {/* Message */}
            <Text className="text-text-secondary text-base text-center mb-6 leading-6">
                {message}
            </Text>

            {/* Footer Info */}
            {footerInfo && (
                <Text className="text-text-tertiary text-sm text-center mb-12 px-4 italic leading-5">
                    {footerInfo}
                </Text>
            )}

            {/* Action Button */}
            <TouchableOpacity
                onPress={primaryAction.onPress}
                className="w-full bg-[#3182CE] rounded-2xl py-4"
            >
                <Text className="text-text-primary text-base font-bold text-center">
                    {primaryAction.label}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
