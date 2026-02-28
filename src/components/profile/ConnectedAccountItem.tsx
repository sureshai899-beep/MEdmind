import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ConnectedAccountItemProps {
    provider: string;
    icon?: React.ReactNode;
    status: "connected" | "disconnected";
    onPress?: () => void;
    className?: string;
}

export const ConnectedAccountItem: React.FC<ConnectedAccountItemProps> = ({
    provider,
    icon,
    status,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center justify-between py-4 border-b border-ui-border",
                className
            )}
        >
            {/* Icon and Provider */}
            <View className="flex-row items-center flex-1">
                {icon && (
                    <View className="w-10 h-10 bg-white rounded-lg items-center justify-center mr-3">
                        {icon}
                    </View>
                )}
                <Text className="text-text-primary text-base font-semibold">{provider}</Text>
            </View>

            {/* Status */}
            <View className="flex-row items-center">
                <Text className="text-text-tertiary text-sm mr-2">
                    {status === "connected" ? "Connected" : "Disconnected"}
                </Text>
                <Text className="text-text-tertiary text-xl">›</Text>
            </View>
        </TouchableOpacity>
    );
};
