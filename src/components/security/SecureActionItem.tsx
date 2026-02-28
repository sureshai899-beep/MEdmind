import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface SecureActionItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
    className?: string;
}

export const SecureActionItem: React.FC<SecureActionItemProps> = ({
    icon,
    title,
    description,
    hasSwitch = false,
    switchValue = false,
    onSwitchChange,
    onPress,
    className = "",
}) => {
    const Content = (
        <View className={`flex-row items-center p-4 bg-[#1A2C28] rounded-2xl mb-3 border border-[#2D3F3A] ${className}`}>
            <View className="w-12 h-12 bg-[#243732] rounded-xl items-center justify-center mr-4">
                <Ionicons name={icon} size={24} color="#4ADE80" />
            </View>

            <View className="flex-1">
                <Text className="text-text-primary text-base font-semibold">{title}</Text>
                {description && (
                    <Text className="text-gray-400 text-sm mt-0.5">{description}</Text>
                )}
            </View>

            {hasSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: "#2D3F3A", true: "#059669" }}
                    thumbColor={switchValue ? "#4ADE80" : "#9CA3AF"}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#4D5F5A" />
            )}
        </View>
    );

    if (hasSwitch) return Content;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            {Content}
        </TouchableOpacity>
    );
};
