import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ColorSwatchProps {
    color: string;
    label: string;
    hexCode: string;
    className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
    color,
    label,
    hexCode,
    className,
}) => {
    return (
        <View className={cn("items-center", className)}>
            {/* Color Circle */}
            <View
                style={{ backgroundColor: color }}
                className="w-16 h-16 rounded-full mb-2"
            />

            {/* Label */}
            <Text className="text-text-primary text-sm font-semibold mb-1">{label}</Text>

            {/* Hex Code */}
            <Text className="text-text-tertiary text-xs">{hexCode}</Text>
        </View>
    );
};
