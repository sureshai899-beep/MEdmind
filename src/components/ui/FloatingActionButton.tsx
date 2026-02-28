import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface FloatingActionButtonProps {
    icon?: string;
    label?: string;
    onPress: () => void;
    position?: "bottom-right" | "bottom-center";
    size?: "md" | "lg";
    className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon = "+",
    label,
    onPress,
    position = "bottom-right",
    size = "md",
    className,
}) => {
    const positionClasses = {
        "bottom-right": "absolute bottom-lg right-lg",
        "bottom-center": "absolute bottom-lg left-0 right-0 mx-auto",
    };

    const sizeClasses = size === "lg" ? "w-16 h-16" : "w-14 h-14";

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={label || "Add item"}
            accessibilityHint="Double tap to perform action"
            className={cn(
                positionClasses[position],
                label ? "flex-row items-center px-lg py-md rounded-full" : cn("rounded-full items-center justify-center", sizeClasses),
                "bg-primary shadow-lg",
                className
            )}
            style={{
                shadowColor: "#10D9A5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            }}
        >
            <Text className={cn("font-bold", label ? "text-xl mr-sm" : "text-3xl", "text-background-primary")}>
                {icon}
            </Text>
            {label && (
                <Text className="text-background-primary font-bold text-body">{label}</Text>
            )}
        </TouchableOpacity>
    );
};
