import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export type LabStatus = "Normal" | "Review" | "Abnormal";

export interface LabTestListItemProps {
    name: string;
    date: string;
    status: LabStatus;
    icon?: string;
    onPress: () => void;
    className?: string;
}

export const LabTestListItem: React.FC<LabTestListItemProps> = ({
    name,
    date,
    status,
    icon = "🧪",
    onPress,
    className,
}) => {
    const statusColors = {
        Normal: "text-primary",
        Review: "text-[#FF9F0A]",
        Abnormal: "text-[#FF453A]",
    };

    const statusDotColors = {
        Normal: "bg-primary",
        Review: "bg-[#FF9F0A]",
        Abnormal: "bg-[#FF453A]",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "flex-row items-center p-5 border-b border-ui-border/30",
                className
            )}
        >
            <View className="w-12 h-12 bg-ui-border/50 rounded-xl items-center justify-center mr-4">
                <Text className="text-xl">{icon}</Text>
            </View>

            <View className="flex-1">
                <Text className="text-text-primary text-lg font-bold mb-1" numberOfLines={1}>
                    {name}
                </Text>
                <Text className="text-text-tertiary text-sm">{date}</Text>
            </View>

            <View className="flex-row items-center">
                <View className={cn("w-2 h-2 rounded-full mr-2", statusDotColors[status])} />
                <Text className={cn("text-sm font-medium mr-3", statusColors[status])}>
                    {status}
                </Text>
                <Text className="text-ui-iconSecondary text-xl">›</Text>
            </View>
        </TouchableOpacity>
    );
};
