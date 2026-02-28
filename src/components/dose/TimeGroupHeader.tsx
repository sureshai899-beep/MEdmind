import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface TimeGroupHeaderProps {
    time: string;
    period?: string;
    className?: string;
}

export const TimeGroupHeader: React.FC<TimeGroupHeaderProps> = ({
    time,
    period,
    className,
}) => {
    return (
        <View className={cn("py-3", className)}>
            <Text className="text-text-primary text-lg font-bold">
                {period} ({time})
            </Text>
        </View>
    );
};
