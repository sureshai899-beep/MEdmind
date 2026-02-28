import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface CaregiverPermissionItemProps {
    icon: React.ReactNode;
    label: string;
    className?: string;
}

export const CaregiverPermissionItem: React.FC<CaregiverPermissionItemProps> = ({
    icon,
    label,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-row items-center py-4 px-4 bg-primary/20 rounded-2xl mb-3",
                className
            )}
        >
            {/* Icon */}
            <View className="w-12 h-12 bg-primary rounded-xl items-center justify-center mr-4">
                {icon}
            </View>

            {/* Label */}
            <Text className="text-text-primary text-base font-semibold flex-1">{label}</Text>
        </View>
    );
};
