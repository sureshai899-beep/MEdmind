import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SettingsLinkItemProps {
    label: string;
    icon: string;
    onPress: () => void;
    className?: string;
}

export const SettingsLinkItem: React.FC<SettingsLinkItemProps> = ({
    label,
    icon,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "flex-row items-center justify-between p-5",
                className
            )}
        >
            <View className="flex-row items-center">
                <Text className="text-xl mr-5">{icon}</Text>
                <Text className="text-text-primary text-lg font-medium">{label}</Text>
            </View>
            <Text className="text-text-tertiary text-xl">›</Text>
        </TouchableOpacity>
    );
};
