import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ExpandableSectionProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    initialExpanded?: boolean;
    className?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
    title,
    icon,
    children,
    initialExpanded = false,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    return (
        <View
            className={cn(
                "bg-background-secondary border border-ui-border rounded-2xl overflow-hidden mb-4",
                className
            )}
        >
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                className="flex-row items-center justify-between p-5"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    {icon && <Text className="text-xl mr-4">{icon}</Text>}
                    <Text className="text-text-primary text-lg font-bold">{title}</Text>
                </View>
                <Text className="text-text-tertiary text-xl">
                    {isExpanded ? "▲" : "▼"}
                </Text>
            </TouchableOpacity>

            {isExpanded && (
                <View className="px-5 pb-5 border-t border-ui-border pt-4">
                    {children}
                </View>
            )}
        </View>
    );
};
