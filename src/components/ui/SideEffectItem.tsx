import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SideEffectItemProps {
    name: string;
    icon?: React.ReactNode;
    iconBg?: string;
    onPress?: () => void;
    className?: string;
}

export const SideEffectItem: React.FC<SideEffectItemProps> = ({
    name,
    icon,
    iconBg = "#1A3D2E",
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center justify-between py-4 border-b border-ui-border",
                className
            )}
        >
            <View className="flex-row items-center flex-1">
                {icon && (
                    <View
                        style={{ backgroundColor: iconBg }}
                        className="w-10 h-10 rounded-full items-center justify-center mr-4"
                    >
                        {icon}
                    </View>
                )}
                <Text className="text-text-primary text-base">{name}</Text>
            </View>

            <Text className="text-text-tertiary text-xl">›</Text>
        </TouchableOpacity>
    );
};
