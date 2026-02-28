import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface DashedUploadBoxProps {
    title: string;
    description: string;
    onPress: () => void;
    className?: string;
}

export const DashedUploadBox: React.FC<DashedUploadBoxProps> = ({
    title,
    description,
    onPress,
    className = "",
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`border-2 border-dashed border-[#2D3F3A] rounded-2xl p-8 items-center justify-center bg-[#142320] ${className}`}
        >
            <View className="w-16 h-16 bg-[#1A2C28] rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-upload-outline" size={32} color="#4ADE80" />
            </View>
            <Text className="text-text-primary text-lg font-semibold mb-1 text-center">{title}</Text>
            <Text className="text-gray-400 text-sm text-center px-4">{description}</Text>
        </TouchableOpacity>
    );
};
