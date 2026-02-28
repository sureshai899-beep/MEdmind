import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "../../utils";

export interface FilterIconButtonProps {
    onPress: () => void;
    active?: boolean;
    className?: string;
}

export const FilterIconButton: React.FC<FilterIconButtonProps> = ({
    onPress,
    active = false,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "w-14 h-14 rounded-2xl items-center justify-center border",
                active
                    ? "bg-primary border-primary"
                    : "bg-ui-border/50 border-ui-border/60",
                className
            )}
        >
            <Text className={cn("text-xl", active ? "text-black" : "text-white")}>
                {/* Simplified filter icon using text/emoji or path if preferred */}
                {active ? "✓" : "≎"}
            </Text>
        </TouchableOpacity>
    );
};
