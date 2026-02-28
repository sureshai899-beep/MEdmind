import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface SuggestionListProps {
    title?: string;
    suggestions: {
        icon: string;
        text: string;
    }[];
    className?: string;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
    title,
    suggestions,
    className,
}) => {
    return (
        <View className={cn("mt-6", className)}>
            {title && (
                <Text className="text-text-primary text-base font-semibold mb-4">{title}</Text>
            )}

            {suggestions.map((suggestion, index) => (
                <View key={index} className="flex-row items-start mb-4">
                    <Text className="text-primary text-lg mr-3">{suggestion.icon}</Text>
                    <Text className="text-text-secondary text-sm flex-1 leading-5">
                        {suggestion.text}
                    </Text>
                </View>
            ))}
        </View>
    );
};
