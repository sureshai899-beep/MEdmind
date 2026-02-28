import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface LabTestItemProps {
    name: string;
    date: string;
    status: "normal" | "review" | "abnormal";
    icon?: string;
    iconBg?: string;
    onPress?: () => void;
    className?: string;
}

export const LabTestItem: React.FC<LabTestItemProps> = ({
    name,
    date,
    status,
    icon = "🧪",
    iconBg = "#2D3748",
    onPress,
    className,
}) => {
    const statusConfig = {
        normal: {
            text: "Normal",
            color: "text-primary",
            dot: "bg-primary",
        },
        review: {
            text: "Review",
            color: "text-status-next",
            dot: "bg-status-next",
        },
        abnormal: {
            text: "Abnormal",
            color: "text-status-missed",
            dot: "bg-status-missed",
        },
    };

    const config = statusConfig[status];

    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                "bg-background-secondary rounded-2xl p-4 mb-3 flex-row items-center",
                "active:opacity-70",
                className
            )}
        >
            {/* Icon */}
            <View
                style={{ backgroundColor: iconBg }}
                className="w-14 h-14 rounded-2xl items-center justify-center mr-3"
            >
                <Text className="text-2xl">{icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold mb-1">{name}</Text>
                <Text className="text-text-tertiary text-sm">{date}</Text>
            </View>

            {/* Status */}
            <View className="flex-row items-center">
                <View className={cn("w-2 h-2 rounded-full mr-2", config.dot)} />
                <Text className={cn("text-sm font-semibold mr-2", config.color)}>
                    {config.text}
                </Text>
                <Text className="text-text-tertiary text-xl">›</Text>
            </View>
        </TouchableOpacity>
    );
};
