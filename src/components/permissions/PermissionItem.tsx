import React from "react";
import { View, Text, Switch } from "react-native";
import { cn } from "../../utils";

export interface PermissionItemProps {
    icon?: string;
    iconBg?: string;
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    className?: string;
}

export const PermissionItem: React.FC<PermissionItemProps> = ({
    icon,
    iconBg = "#D1FAE5",
    title,
    description,
    value,
    onValueChange,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-row items-center py-4 px-4 bg-white rounded-2xl mb-3",
                className
            )}
        >
            {/* Icon */}
            {icon && (
                <View
                    style={{ backgroundColor: iconBg }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                >
                    <Text className="text-2xl">{icon}</Text>
                </View>
            )}

            {/* Content */}
            <View className="flex-1">
                <Text className="text-[#1F2937] text-base font-semibold mb-1">
                    {title}
                </Text>
                <Text className="text-[#6B7280] text-sm">{description}</Text>
            </View>

            {/* Switch */}
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#D1D5DB", true: "#10D9A5" }}
                thumbColor="#FFFFFF"
            />
        </View>
    );
};
