import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface RefillHistoryItemProps {
    date: string;
    source: string;
    amount: string;
    className?: string;
}

export const RefillHistoryItem: React.FC<RefillHistoryItemProps> = ({
    date,
    source,
    amount,
    className,
}) => {
    return (
        <View
            className={cn(
                "bg-background-secondary border border-ui-border rounded-2xl p-4 flex-row justify-between items-center",
                className
            )}
        >
            <View>
                <Text className="text-text-primary text-base font-bold mb-1">{date}</Text>
                <Text className="text-text-secondary text-sm">{source}</Text>
            </View>
            <Text className="text-primary text-base font-bold">{amount}</Text>
        </View>
    );
};
