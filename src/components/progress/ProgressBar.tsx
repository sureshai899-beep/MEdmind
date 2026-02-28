import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ProgressBarProps {
    progress: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    color?: string;
    backgroundColor?: string;
    height?: number;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    label,
    showPercentage = true,
    color = "#10D9A5",
    backgroundColor = "#2D3748",
    height = 8,
    className,
}) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View className={cn("w-full", className)}>
            {label && (
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-text-primary text-sm font-medium">{label}</Text>
                    {showPercentage && (
                        <Text className="text-text-secondary text-sm">
                            {Math.round(clampedProgress)}%
                        </Text>
                    )}
                </View>
            )}

            <View
                style={{
                    height,
                    backgroundColor,
                }}
                className="w-full rounded-full overflow-hidden"
            >
                <View
                    style={{
                        width: `${clampedProgress}%`,
                        height: "100%",
                        backgroundColor: color,
                    }}
                    className="rounded-full"
                />
            </View>
        </View>
    );
};
