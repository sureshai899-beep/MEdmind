import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { cn } from "../../utils";

export interface RefillSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    label?: string;
    unit?: string;
    className?: string;
}

export const RefillSlider: React.FC<RefillSliderProps> = ({
    value,
    onValueChange,
    minimumValue = 0,
    maximumValue = 30,
    step = 1,
    label = "Remind when supply is below:",
    unit = "pills",
    className,
}) => {
    return (
        <View className={cn("", className)}>
            {/* Label and Value */}
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-text-primary text-sm">{label}</Text>
                <Text className="text-text-primary text-base font-bold">
                    {value} {unit}
                </Text>
            </View>

            {/* Slider */}
            <Slider
                value={value}
                onValueChange={onValueChange}
                minimumValue={minimumValue}
                maximumValue={maximumValue}
                step={step}
                minimumTrackTintColor="#10D9A5"
                maximumTrackTintColor="#2D3748"
                thumbTintColor="#10D9A5"
            />
        </View>
    );
};
