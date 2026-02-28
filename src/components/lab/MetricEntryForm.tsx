import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface MetricEntryFormProps {
    label: string;
    value: string;
    unit: string;
    timestamp: string;
    onValueChange: (val: string) => void;
    onUnitPress?: () => void;
    onTimestampPress?: () => void;
    className?: string;
}

export const MetricEntryForm: React.FC<MetricEntryFormProps> = ({
    label,
    value,
    unit,
    timestamp,
    onValueChange,
    onUnitPress,
    onTimestampPress,
    className = "",
}) => {
    return (
        <View className={`bg-[#1A2C28] p-4 rounded-2xl border border-[#2D3F3A] ${className}`}>
            <Text className="text-gray-400 text-sm font-medium mb-2">{label}</Text>

            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1 flex-row items-end">
                    <TextInput
                        className="text-text-primary text-4xl font-bold p-0"
                        value={value}
                        onChangeText={onValueChange}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor="#4D5F5A"
                    />
                    <TouchableOpacity onPress={onUnitPress} className="ml-2 pb-1">
                        <Text className="text-[#4ADE80] text-lg font-semibold">{unit}</Text>
                    </TouchableOpacity>
                </View>

                <Ionicons name="stats-chart" size={24} color="#4ADE80" />
            </View>

            <TouchableOpacity
                onPress={onTimestampPress}
                className="flex-row items-center bg-[#243732] py-2 px-3 rounded-xl self-start"
            >
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-300 text-xs ml-2">{timestamp}</Text>
                <Ionicons name="chevron-down" size={14} color="#9CA3AF" className="ml-1" />
            </TouchableOpacity>
        </View>
    );
};
