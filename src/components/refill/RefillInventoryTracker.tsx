import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface RefillInventoryTrackerProps {
    remainingCount: number;
    totalCount: number;
    unit?: string;
    className?: string;
}

export const RefillInventoryTracker: React.FC<RefillInventoryTrackerProps> = ({
    remainingCount,
    totalCount,
    unit = "Pills",
    className,
}) => {
    const progress = Math.min((remainingCount / totalCount) * 100, 100);

    return (
        <View className={cn("px-4", className)}>
            <View className="flex-row justify-between items-end mb-4">
                <Text className="text-text-secondary text-base font-medium">Remaining {unit}</Text>
                <Text className="text-text-primary text-xl font-bold">{remainingCount}</Text>
            </View>

            {/* Progress Bar Container */}
            <View className="w-full h-2.5 bg-ui-border rounded-full overflow-hidden">
                <View
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </View>
        </View>
    );
};
