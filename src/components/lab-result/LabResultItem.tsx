import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface LabResultItemProps {
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: "normal" | "high" | "low";
    className?: string;
}

export const LabResultItem: React.FC<LabResultItemProps> = ({
    testName,
    value,
    unit,
    referenceRange,
    status,
    className,
}) => {
    const statusConfig = {
        normal: {
            color: "text-white",
            icon: "",
        },
        high: {
            color: "text-status-missed",
            icon: "↑",
        },
        low: {
            color: "text-[#3B82F6]",
            icon: "↓",
        },
    };

    const config = statusConfig[status];

    return (
        <View
            className={cn(
                "flex-row justify-between items-center py-4 border-b border-ui-border",
                className
            )}
        >
            {/* Test Name and Reference */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-semibold mb-1">
                    {testName}
                </Text>
                <Text className="text-text-tertiary text-xs">Ref: {referenceRange}</Text>
            </View>

            {/* Value */}
            <View className="items-end">
                <Text className={cn("text-base font-bold", config.color)}>
                    {value} {unit} {config.icon}
                </Text>
            </View>
        </View>
    );
};
