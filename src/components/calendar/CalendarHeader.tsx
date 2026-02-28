import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface CalendarHeaderProps {
    month: string;
    year: number;
    onPrevious?: () => void;
    onNext?: () => void;
    className?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    month,
    year,
    onPrevious,
    onNext,
    className,
}) => {
    return (
        <View className={cn("flex-row items-center justify-between py-4", className)}>
            <TouchableOpacity
                onPress={onPrevious}
                disabled={!onPrevious}
                className="w-10 h-10 items-center justify-center"
            >
                <Text className="text-text-primary text-xl">‹</Text>
            </TouchableOpacity>

            <Text className="text-text-primary text-lg font-bold">
                {month} {year}
            </Text>

            <TouchableOpacity
                onPress={onNext}
                disabled={!onNext}
                className="w-10 h-10 items-center justify-center"
            >
                <Text className="text-text-primary text-xl">›</Text>
            </TouchableOpacity>
        </View>
    );
};
