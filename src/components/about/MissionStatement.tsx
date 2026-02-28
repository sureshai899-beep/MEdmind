import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface MissionStatementProps {
    text: string;
    className?: string;
}

export const MissionStatement: React.FC<MissionStatementProps> = ({
    text,
    className,
}) => {
    return (
        <View className={cn("px-6 py-4", className)}>
            <Text className="text-text-secondary text-base text-center leading-6">
                {text}
            </Text>
        </View>
    );
};
