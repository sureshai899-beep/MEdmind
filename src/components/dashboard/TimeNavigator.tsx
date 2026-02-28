import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export type TimePeriod = "Yesterday" | "Today" | "Tomorrow";

export interface TimeNavigatorProps {
    activePeriod: TimePeriod;
    onPeriodChange: (period: TimePeriod) => void;
    className?: string;
}

export const TimeNavigator: React.FC<TimeNavigatorProps> = ({
    activePeriod,
    onPeriodChange,
    className,
}) => {
    const periods: TimePeriod[] = ["Yesterday", "Today", "Tomorrow"];

    return (
        <View
            className={cn(
                "flex-row bg-background-secondary p-xs rounded-2xl mx-md mb-lg",
                className
            )}
        >
            {periods.map((period) => (
                <TouchableOpacity
                    key={period}
                    onPress={() => onPeriodChange(period)}
                    className={cn(
                        "flex-1 py-3 rounded-xl items-center justify-center",
                        activePeriod === period ? "bg-primary" : "bg-transparent"
                    )}
                >
                    <Text
                        className={cn(
                            "text-sm font-bold",
                            activePeriod === period ? "text-black" : "text-text-tertiary"
                        )}
                    >
                        {period}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
