import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface InteractionDetailsHeaderProps {
    title: string;
    riskLevel: string;
    summary: string;
    icon?: string;
    className?: string;
}

export const InteractionDetailsHeader: React.FC<InteractionDetailsHeaderProps> = ({
    title,
    riskLevel,
    summary,
    icon = "🥗",
    className,
}) => {
    return (
        <View className={cn("w-full mb-8", className)}>
            <View className="w-full aspect-[4/3] bg-ui-border rounded-3xl overflow-hidden mb-6 items-center justify-center border border-ui-border/50">
                <Text className="text-8xl">{icon}</Text>
            </View>

            <Text className="text-text-primary text-3xl font-bold mb-3">
                {title}
            </Text>

            <View className="flex-row items-center mb-4">
                <Text className="text-primary text-lg font-bold tracking-tight">
                    {riskLevel}
                </Text>
            </View>

            <Text className="text-text-secondary text-lg leading-7">
                {summary}
            </Text>
        </View>
    );
};
