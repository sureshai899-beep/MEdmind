import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface TypographyExampleProps {
    variant: "heading1" | "heading2" | "body" | "button";
    text: string;
    fontFamily?: string;
    fontSize?: string;
    className?: string;
}

export const TypographyExample: React.FC<TypographyExampleProps> = ({
    variant,
    text,
    fontFamily,
    fontSize,
    className,
}) => {
    const variantConfig = {
        heading1: {
            className: "text-white text-3xl font-bold",
            label: "Heading 1",
        },
        heading2: {
            className: "text-white text-2xl font-bold",
            label: "Heading 2",
        },
        body: {
            className: "text-text-secondary text-base",
            label: "Body Text",
        },
        button: {
            className: "text-white text-sm font-bold",
            label: "Button Text",
        },
    };

    const config = variantConfig[variant];

    return (
        <View className={cn("mb-6", className)}>
            {/* Meta Info */}
            <View className="mb-2">
                <Text className="text-text-tertiary text-xs mb-1">
                    {fontFamily} / {fontSize}
                </Text>
                <Text className="text-text-tertiary text-xs">{config.label}</Text>
            </View>

            {/* Example Text */}
            <Text className={config.className}>{text}</Text>
        </View>
    );
};
