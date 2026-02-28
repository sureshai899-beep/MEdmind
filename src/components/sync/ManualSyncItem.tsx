import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ManualSyncItemProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    buttonText?: string;
    onPress?: () => void;
    className?: string;
}

export const ManualSyncItem: React.FC<ManualSyncItemProps> = ({
    icon,
    title,
    description,
    buttonText = "Sync Now",
    onPress,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-row items-center justify-between py-4 border-b border-ui-border",
                className
            )}
        >
            {/* Icon and Content */}
            <View className="flex-row items-center flex-1">
                {icon && (
                    <View className="w-10 h-10 bg-ui-border rounded-xl items-center justify-center mr-3">
                        {icon}
                    </View>
                )}
                <View className="flex-1">
                    <Text className="text-text-primary text-base font-semibold mb-1">{title}</Text>
                    <Text className="text-text-tertiary text-sm">{description}</Text>
                </View>
            </View>

            {/* Sync Button */}
            {onPress && (
                <TouchableOpacity
                    onPress={onPress}
                    className="bg-[#3B82F6] px-4 py-2 rounded-xl ml-3"
                >
                    <Text className="text-text-primary text-sm font-bold">{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
