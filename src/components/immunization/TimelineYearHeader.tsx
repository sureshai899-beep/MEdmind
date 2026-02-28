import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface TimelineYearHeaderProps {
    year: string;
    className?: string;
}

export const TimelineYearHeader: React.FC<TimelineYearHeaderProps> = ({
    year,
    className,
}) => {
    return (
        <View className={cn("py-3", className)}>
            <Text className="text-text-primary text-xl font-bold">{year}</Text>
        </View>
    );
};
