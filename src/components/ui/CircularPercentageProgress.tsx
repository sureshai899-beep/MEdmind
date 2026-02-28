import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface CircularPercentageProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const CircularPercentageProgress: React.FC<CircularPercentageProgressProps> = ({
    percentage,
    size = 120,
    strokeWidth = 10,
    className,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <View
            style={{ width: size, height: size }}
            className={cn("items-center justify-center", className)}
        >
            {/* Background Circle */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: "#1A2E2C",
                    position: "absolute",
                }}
            />
            {/* Foreground Circle (Simulated with border-top/left etc for vanilla style or view) */}
            {/* Note: For high fidelity, SVG is better, but following the "no-new-deps" and modular approach with vanilla RN views where possible */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: "#10D9A5",
                    position: "absolute",
                    borderBottomColor: percentage < 75 ? "transparent" : "#10D9A5",
                    borderRightColor: percentage < 25 ? "transparent" : "#10D9A5",
                    borderLeftColor: percentage < 50 ? "transparent" : "#10D9A5",
                    transform: [{ rotate: "45deg" }]
                }}
            />

            <View className="items-center justify-center">
                <Text className="text-text-primary text-3xl font-bold">
                    {percentage}%
                </Text>
            </View>
        </View>
    );
};
