import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface CalendarDayProps {
    day: number;
    status?: "taken" | "missed" | "partial" | "none";
    isToday?: boolean;
    onPress?: () => void;
    className?: string;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
    day,
    status = "none",
    isToday = false,
    onPress,
    className,
}) => {
    const statusColors = {
        taken: "bg-primary",
        missed: "bg-status-missed",
        partial: "bg-status-next",
        none: "bg-transparent",
    };

    const statusDots = {
        taken: "#10D9A5",
        missed: "#E74C3C",
        partial: "#FF8A3D",
        none: "transparent",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn("items-center justify-center py-3", className)}
        >
            <View
                className={cn(
                    "w-12 h-12 rounded-full items-center justify-center",
                    isToday && "bg-[#3B82F6]",
                    !isToday && "bg-transparent"
                )}
            >
                <Text
                    className={cn(
                        "text-base font-medium",
                        isToday ? "text-white" : "text-[#E5E7EB]"
                    )}
                >
                    {day}
                </Text>
            </View>

            {status !== "none" && (
                <View
                    style={{ backgroundColor: statusDots[status] }}
                    className="w-1.5 h-1.5 rounded-full mt-1"
                />
            )}
        </TouchableOpacity>
    );
};
