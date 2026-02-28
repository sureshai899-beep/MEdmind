import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SettingsGroupItemProps {
    label: string;
    icon: string;
    onPress: () => void;
    className?: string;
}

export const SettingsGroupItem: React.FC<SettingsGroupItemProps> = ({
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
                "flex-row items-center justify-between p-5 border-b border-ui-border/30",
                className
            )}
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 bg-ui-border/50 rounded-lg items-center justify-center mr-4">
                    <Text className="text-lg">{icon}</Text>
                </View>
                <Text className="text-text-primary text-lg font-medium">{label}</Text>
            </View>
            <Text className="text-ui-iconSecondary text-xl">›</Text>
        </TouchableOpacity>
    );
};
