import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { cn } from "../../utils";

export interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    label?: string;
    showPercentage?: boolean;
    icon?: string;
    className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 200,
    strokeWidth = 12,
    label,
    showPercentage = true,
    icon,
    className,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View className={cn("items-center justify-center", className)}>
            <View style={{ width: size, height: size }} className="relative items-center justify-center">
                <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#2D3748"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#10D9A5"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </Svg>

                {/* Center Content */}
                <View className="absolute items-center justify-center">
                    {icon && <Text className="text-4xl mb-2">{icon}</Text>}
                    {showPercentage && (
                        <Text className="text-text-primary text-4xl font-bold">
                            {Math.round(progress)}%
                        </Text>
                    )}
                </View>
            </View>

            {label && (
                <Text className="text-text-secondary text-base mt-4 text-center">
                    {label}
                </Text>
            )}
        </View>
    );
};
