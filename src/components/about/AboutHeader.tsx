import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "../../utils";

export interface AboutHeaderProps {
    appName: string;
    version: string;
    icon?: React.ReactNode;
    iconBg?: string;
    className?: string;
}

export const AboutHeader: React.FC<AboutHeaderProps> = ({
    appName,
    version,
    icon,
    iconBg = "#2D4A5C",
    className,
}) => {
    return (
        <View className={cn("items-center py-8", className)}>
            {/* App Icon */}
            {icon && (
                <View
                    style={{ backgroundColor: iconBg }}
                    className="w-24 h-24 rounded-full items-center justify-center mb-6"
                >
                    {icon}
                </View>
            )}

            {/* App Name */}
            <Text className="text-text-primary text-2xl font-bold mb-2">{appName}</Text>

            {/* Version */}
            <Text className="text-text-tertiary text-base">Version {version}</Text>
        </View>
    );
};
