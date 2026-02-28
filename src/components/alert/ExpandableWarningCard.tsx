import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

export interface ExpandableWarningCardProps {
    title: string;
    summary: string;
    details: string;
    type?: "warning" | "error";
    className?: string;
}

export const ExpandableWarningCard: React.FC<ExpandableWarningCardProps> = ({
    title,
    summary,
    details,
    type = "warning",
    className = "",
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const bgColor = type === "error" ? "bg-[#3D1A1A]" : "bg-[#2D2A1A]";
    const borderColor = type === "error" ? "border-[#5B2E2E]" : "border-[#4D493A]";
    const iconColor = type === "error" ? "#EF4444" : "#FBBF24";

    return (
        <View className={`${bgColor} border ${borderColor} rounded-2xl p-4 mb-4 ${className}`}>
            <View className="flex-row items-start mb-2">
                <View className="mt-0.5 mr-3">
                    <AntDesign name="warning" size={20} color={iconColor} />
                </View>
                <View className="flex-1">
                    <Text className="text-text-primary text-base font-bold mb-1">{title}</Text>
                    <Text className="text-gray-300 text-sm leading-5">{summary}</Text>
                </View>
            </View>

            {isExpanded && (
                <View className="mt-3 pt-3 border-t border-[#FFFFFF1A]">
                    <Text className="text-gray-400 text-sm leading-5">{details}</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                className="mt-3 flex-row items-center justify-center p-2 rounded-xl bg-[#FFFFFF0A]"
            >
                <Text className="text-text-primary text-xs font-semibold mr-1">
                    {isExpanded ? "Show Less" : "See Full Warning"}
                </Text>
                <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#FFFFFF"
                />
            </TouchableOpacity>
        </View>
    );
};
