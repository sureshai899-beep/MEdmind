import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface SectionHeaderProps {
    title: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    className,
}) => {
    return (
        <View className={cn("py-3", className)}>
            <Text className="text-text-tertiary text-xs font-bold uppercase tracking-wider">
                {title}
            </Text>
        </View>
    );
};
