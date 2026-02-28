import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface PasswordStrengthIndicatorProps {
    strength: "weak" | "medium" | "strong";
    className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    strength,
    className,
}) => {
    const strengthConfig = {
        weak: {
            label: "Weak",
            color: "#E74C3C",
            percentage: 33,
        },
        medium: {
            label: "Medium",
            color: "#FF8A3D",
            percentage: 66,
        },
        strong: {
            label: "Strong",
            color: "#10D9A5",
            percentage: 100,
        },
    };

    const config = strengthConfig[strength];

    return (
        <View className={cn("", className)}>
            {/* Label and Strength */}
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-text-tertiary text-sm">Password Strength</Text>
                <Text
                    style={{ color: config.color }}
                    className="text-sm font-semibold"
                >
                    {config.label}
                </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <View
                    style={{
                        width: `${config.percentage}%`,
                        backgroundColor: config.color,
                    }}
                    className="h-full rounded-full"
                />
            </View>
        </View>
    );
};
