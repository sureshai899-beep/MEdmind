import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ReminderTimingItemProps {
    icon?: React.ReactNode;
    label: string;
    value: string;
    onPress?: () => void;
    className?: string;
}

export const ReminderTimingItem: React.FC<ReminderTimingItemProps> = ({
    icon,
    label,
    value,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center justify-between py-4 px-4 bg-primary/20 rounded-xl",
                className
            )}
        >
            {/* Icon and Label */}
            <View className="flex-row items-center flex-1">
                {icon && <View className="mr-3">{icon}</View>}
                <Text className="text-text-primary text-base">{label}</Text>
            </View>

            {/* Value and Chevron */}
            <View className="flex-row items-center">
                <Text className="text-text-secondary text-base mr-2">{value}</Text>
                <Text className="text-text-secondary text-xl">›</Text>
            </View>
        </TouchableOpacity>
    );
};
