import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface SettingsCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
    title,
    children,
    className,
}) => {
    return (
        <View className={cn("mb-8", className)}>
            {title && (
                <Text className="text-text-tertiary text-xs font-bold uppercase tracking-widest mb-3 ml-4">
                    {title}
                </Text>
            )}
            <View className="bg-[#1A2E2C]/60 rounded-3xl overflow-hidden border border-ui-border/30">
                {children}
            </View>
        </View>
    );
};
