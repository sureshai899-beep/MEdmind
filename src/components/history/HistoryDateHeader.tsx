import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface HistoryDateHeaderProps {
    date: string;
    className?: string;
}

export const HistoryDateHeader: React.FC<HistoryDateHeaderProps> = ({
    date,
    className,
}) => {
    return (
        <View className={cn("py-3", className)}>
            <Text className="text-text-tertiary text-sm font-semibold text-center">
                {date}
            </Text>
        </View>
    );
};
