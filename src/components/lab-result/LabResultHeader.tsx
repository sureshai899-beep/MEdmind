import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface LabResultHeaderProps {
    title: string;
    date: string;
    className?: string;
}

export const LabResultHeader: React.FC<LabResultHeaderProps> = ({
    title,
    date,
    className,
}) => {
    return (
        <View className={cn("mb-6", className)}>
            <Text className="text-text-primary text-2xl font-bold mb-2">{title}</Text>
            <Text className="text-text-tertiary text-sm">{date}</Text>
        </View>
    );
};
