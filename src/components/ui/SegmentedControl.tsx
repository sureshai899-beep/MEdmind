import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SegmentedControlProps {
    options: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    variant?: "default" | "dark";
    className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    selectedIndex,
    onSelect,
    variant = "default",
    className,
}) => {
    const variantStyles: Record<NonNullable<SegmentedControlProps["variant"]>, { container: string; selected: string; unselected: string }> = {
        default: {
            container: "bg-background-secondary",
            selected: "bg-ui-border",
            unselected: "bg-transparent",
        },
        dark: {
            container: "bg-background-primary",
            selected: "bg-background-secondary",
            unselected: "bg-transparent",
        },
    };

    const styles = variantStyles[variant];

    return (
        <View
            className={cn(
                "flex-row rounded-xl p-1",
                styles.container,
                className
            )}
        >
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onSelect(index)}
                    className={cn(
                        "flex-1 py-2 px-4 rounded-lg",
                        index === selectedIndex ? styles.selected : styles.unselected
                    )}
                >
                    <Text
                        className={cn(
                            "text-center text-sm font-medium",
                            index === selectedIndex ? "text-white" : "text-text-tertiary"
                        )}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
