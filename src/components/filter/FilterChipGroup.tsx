import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface FilterChipGroupProps {
    options: {
        label: string;
        value: string;
        isSelected?: boolean;
    }[];
    onSelect: (value: string) => void;
    className?: string;
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({
    options,
    onSelect,
    className,
}) => {
    return (
        <View className={cn("flex-row flex-wrap gap-2", className)}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onSelect(option.value)}
                    className={cn(
                        "px-4 py-2 rounded-full border",
                        option.isSelected
                            ? "bg-primary border-primary"
                            : "bg-transparent border-ui-border"
                    )}
                >
                    <View className="flex-row items-center">
                        {option.isSelected && (
                            <Text className="text-black text-sm mr-2">✓</Text>
                        )}
                        <Text
                            className={cn(
                                "text-sm font-medium",
                                option.isSelected ? "text-black" : "text-white"
                            )}
                        >
                            {option.label}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};
