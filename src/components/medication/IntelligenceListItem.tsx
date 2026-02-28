import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface IntelligenceListItemProps {
    title: string;
    subtitle: string;
    icon?: string;
    onPress: () => void;
    className?: string;
}

export const IntelligenceListItem: React.FC<IntelligenceListItemProps> = ({
    title,
    subtitle,
    icon = "💊",
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "w-full flex-row items-center py-4 px-1",
                className
            )}
        >
            <View className="w-12 h-12 bg-[#1A2E2C]/80 rounded-full items-center justify-center mr-4">
                <Text className="text-xl">{icon}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-text-primary text-lg font-bold">{title}</Text>
                <Text className="text-text-tertiary text-sm">{subtitle}</Text>
            </View>
            <Text className="text-ui-iconSecondary text-2xl font-light">›</Text>
        </TouchableOpacity>
    );
};
