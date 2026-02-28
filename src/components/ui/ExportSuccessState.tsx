import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";

export interface ExportSuccessStateProps {
    title: string;
    message: string;
    onDone: () => void;
    onShare?: () => void;
    className?: string;
}

export const ExportSuccessState: React.FC<ExportSuccessStateProps> = ({
    title,
    message,
    onDone,
    onShare,
    className = "",
}) => {
    return (
        <View className={`flex-1 bg-[#0F1D1A] items-center justify-center px-6 ${className}`}>
            <View className="w-24 h-24 bg-[#1A2C28] rounded-full items-center justify-center mb-8 border border-[#2D3F3A]">
                <View className="w-16 h-16 bg-[#4ADE80] rounded-full items-center justify-center">
                    <Ionicons name="document-text" size={36} color="#0F1D1A" />
                </View>
                <View className="absolute bottom-0 right-0 w-8 h-8 bg-[#4ADE80] rounded-full border-4 border-[#0F1D1A] items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="#0F1D1A" />
                </View>
            </View>

            <Text className="text-text-primary text-2xl font-bold mb-3 text-center">{title}</Text>
            <Text className="text-gray-400 text-base text-center mb-10 leading-6">
                {message}
            </Text>

            <View className="w-full gap-4">
                {onShare && (
                    <Button variant="secondary" size="lg" onPress={onShare}>
                        Share Document
                    </Button>
                )}
                <Button variant="primary" size="lg" onPress={onDone}>
                    Done
                </Button>
            </View>
        </View>
    );
};
