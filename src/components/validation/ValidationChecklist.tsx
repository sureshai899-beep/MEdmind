import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ValidationChecklistProps {
    items: {
        label: string;
        checked: boolean;
    }[];
    className?: string;
}

export const ValidationChecklist: React.FC<ValidationChecklistProps> = ({
    items,
    className,
}) => {
    return (
        <View className={cn("mt-6", className)}>
            {items.map((item, index) => (
                <View key={index} className="flex-row items-center mb-3">
                    <View
                        className={cn(
                            "w-6 h-6 rounded items-center justify-center mr-3",
                            item.checked ? "bg-primary" : "bg-transparent border border-ui-border"
                        )}
                    >
                        {item.checked && (
                            <Text className="text-text-primary text-sm font-bold">✓</Text>
                        )}
                    </View>
                    <Text
                        className={cn(
                            "text-base",
                            item.checked ? "text-primary" : "text-text-tertiary"
                        )}
                    >
                        {item.label}
                    </Text>
                </View>
            ))}
        </View>
    );
};
