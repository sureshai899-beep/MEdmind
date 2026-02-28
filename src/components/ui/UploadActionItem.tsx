import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface UploadActionItemProps {
    title: string;
    icon: string;
    onPress: () => void;
    className?: string;
}

export const UploadActionItem: React.FC<UploadActionItemProps> = ({
    title,
    icon,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "w-full bg-[#1A2E2C]/60 border border-ui-border/30 rounded-2xl p-5 flex-row items-center mb-4",
                className
            )}
        >
            <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-5">
                <Text className="text-2xl">{icon}</Text>
            </View>
            <Text className="flex-1 text-text-primary text-lg font-bold">
                {title}
            </Text>
            <Text className="text-ui-iconSecondary text-2xl">›</Text>
        </TouchableOpacity>
    );
};
