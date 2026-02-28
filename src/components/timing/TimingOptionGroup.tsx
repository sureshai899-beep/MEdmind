import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";


export interface TimingOptionGroupProps {
    label: string;
    options: {
        value: string;
        label: string;
    }[];
    selectedValue: string;
    onSelect: (value: string) => void;
    className?: string;
}

export const TimingOptionGroup: React.FC<TimingOptionGroupProps> = ({
    label,
    options,
    selectedValue,
    onSelect,
    className,
}) => {
    return (
        <View className={cn("", className)}>
            <Text className="text-text-primary text-base font-bold mb-3">{label}</Text>

            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = option.value === selectedValue;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onSelect(option.value)}
                            className={cn(
                                "px-4 py-3 rounded-xl",
                                isSelected ? "bg-[#3B82F6]" : "bg-ui-border"
                            )}
                        >
                            <Text
                                className={cn(
                                    "text-sm font-semibold",
                                    isSelected ? "text-white" : "text-text-secondary"
                                )}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
