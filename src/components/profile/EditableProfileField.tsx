import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface EditableProfileFieldProps {
    label: string;
    value: string;
    onPress: () => void;
    className?: string;
}

export const EditableProfileField: React.FC<EditableProfileFieldProps> = ({
    label,
    value,
    onPress,
    className = "",
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`bg-[#1A2C28] p-4 rounded-2xl border border-[#2D3F3A] mb-4 flex-row items-center justify-between ${className}`}
        >
            <View className="flex-1 mr-4">
                <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                    {label}
                </Text>
                <Text className="text-text-primary text-base font-semibold">{value}</Text>
            </View>

            <View className="w-8 h-8 rounded-full bg-[#243732] items-center justify-center">
                <Ionicons name="pencil-sharp" size={16} color="#4ADE80" />
            </View>
        </TouchableOpacity>
    );
};
