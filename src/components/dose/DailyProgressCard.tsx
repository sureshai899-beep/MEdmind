import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface DailyProgressCardProps {
    title?: string;
    subtitle?: string;
    progress: number; // 0-100
    onPress?: () => void;
    className?: string;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
    title = "Daily Progress",
    subtitle = "Tap 3D pill for stats",
    progress,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "bg-primary/20 rounded-2xl p-4 mb-4 flex-row items-center",
                className
            )}
        >
            {/* 3D Pill Icon */}
            <View className="mr-4">
                <Text className="text-6xl">💊</Text>
            </View>

            {/* Progress Info */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold mb-1">{title}</Text>
                <Text className="text-text-tertiary text-sm mb-2">{subtitle}</Text>

                {/* Progress Bar */}
                <View className="h-2 bg-ui-border rounded-full overflow-hidden">
                    <View
                        style={{ width: `${progress}%` }}
                        className="h-full bg-primary rounded-full"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};
