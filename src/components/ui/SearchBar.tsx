import React from "react";
import { TextInput, View, Text } from "react-native";
import { cn } from "../../utils";

export interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    className?: string;
    variant?: "default" | "dark";
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    value,
    onChangeText,
    className,
    variant = "default",
}) => {
    const variantStyles: Record<NonNullable<SearchBarProps["variant"]>, string> = {
        default: "bg-ui-input",
        dark: "bg-background-dark",
    };

    return (
        <View
            className={cn(
                "flex-row items-center rounded-xl px-4 py-3",
                variantStyles[variant as NonNullable<SearchBarProps["variant"]>],
                className
            )}
        >
            <Text className="text-primary text-lg mr-2">🔍</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#718096"
                value={value}
                onChangeText={onChangeText}
                className="flex-1 text-text-primary text-base"
            />
        </View>
    );
};
