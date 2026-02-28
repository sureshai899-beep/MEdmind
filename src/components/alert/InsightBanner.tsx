import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface InsightBannerProps {
    title: string;
    message: string;
    onClose: () => void;
    className?: string;
}

export const InsightBanner: React.FC<InsightBannerProps> = ({
    title,
    message,
    onClose,
    className,
}) => {
    return (
        <View
            className={cn(
                "bg-[#1A2E2C] border border-ui-border/40 rounded-2xl p-5 mb-8",
                className
            )}
        >
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <Text className="text-lg mr-2">💡</Text>
                    <Text className="text-text-primary text-base font-bold">
                        {title}
                    </Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                    <Text className="text-text-tertiary text-xl font-light">✕</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-text-secondary text-sm leading-5">
                {message}
            </Text>
        </View>
    );
};
