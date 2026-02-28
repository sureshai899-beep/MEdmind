import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { cn } from "../../utils";

export interface ProfileListItemProps {
    name: string;
    relationship?: string;
    profilePictureUrl?: string;
    status?: "active" | "inactive" | "pending";
    isSelected?: boolean;
    onPress?: () => void;
    className?: string;
}

export const ProfileListItem: React.FC<ProfileListItemProps> = ({
    name,
    relationship,
    profilePictureUrl,
    status = "active",
    isSelected = false,
    onPress,
    className,
}) => {
    const statusConfig = {
        active: {
            dot: "bg-primary",
            icon: "✓",
            showIcon: true,
        },
        inactive: {
            dot: "bg-status-missed",
            icon: "",
            showIcon: false,
        },
        pending: {
            dot: "bg-text-tertiary",
            icon: "",
            showIcon: false,
        },
    };

    const config = statusConfig[status];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center py-4 px-4 rounded-2xl mb-3",
                isSelected ? "bg-primary/20 border-2 border-primary" : "bg-primary/20",
                className
            )}
        >
            {/* Avatar */}
            <View className="w-14 h-14 rounded-full bg-[#E8C4A0] items-center justify-center mr-4">
                {profilePictureUrl ? (
                    <Image source={{ uri: profilePictureUrl }} className="w-full h-full rounded-full" />
                ) : (
                    <Text className="text-text-primary text-2xl">👤</Text>
                )}
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold mb-1">{name}</Text>
                {relationship && (
                    <Text className="text-text-secondary text-sm">{relationship}</Text>
                )}
            </View>

            {/* Status Indicator */}
            <View className="flex-row items-center">
                <View className={cn("w-3 h-3 rounded-full mr-2", config.dot)} />
                {config.showIcon && isSelected && (
                    <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                        <Text className="text-text-primary text-xs">{config.icon}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};
