import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface RefillStatsCardProps {
    label: string;
    value: string;
    className?: string;
}

export const RefillStatsCard: React.FC<RefillStatsCardProps> = ({
    label,
    value,
    className,
}) => {
    return (
        <View
            className={cn(
                "bg-background-secondary border border-ui-border rounded-2xl p-5 flex-1",
                className
            )}
        >
            <Text className="text-text-tertiary text-sm mb-2">{label}</Text>
            <Text className="text-text-primary text-2xl font-bold">{value}</Text>
        </View>
    );
};
