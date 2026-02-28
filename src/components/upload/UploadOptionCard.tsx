import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface UploadOptionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress?: () => void;
    className?: string;
}

export const UploadOptionCard: React.FC<UploadOptionCardProps> = ({
    icon,
    title,
    description,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "bg-primary/20 rounded-2xl p-6 mb-4 flex-row items-center",
                className
            )}
        >
            {/* Icon */}
            <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center mr-4">
                {icon}
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-lg font-bold mb-1">{title}</Text>
                <Text className="text-text-secondary text-sm">{description}</Text>
            </View>
        </TouchableOpacity>
    );
};
