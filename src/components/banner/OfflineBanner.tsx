import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface OfflineStatusBannerProps {
    message: string;
    className?: string;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({
    message,
    className,
}) => {
    return (
        <View
            className={cn(
                "bg-ui-border rounded-2xl p-4 flex-row items-center",
                className
            )}
        >
            <View className="w-10 h-10 bg-primary/20 rounded-xl items-center justify-center mr-4">
                <Text className="text-primary text-xl">🔄</Text>
            </View>
            <View className="flex-1">
                <Text className="text-text-primary text-sm font-bold">Changes saved offline</Text>
                <Text className="text-text-secondary text-xs">{message}</Text>
            </View>
        </View>
    );
};
