import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "../../utils";

export interface SearchChipProps {
    label: string;
    onPress: () => void;
    className?: string;
}

export const SearchChip: React.FC<SearchChipProps> = ({
    label,
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "bg-ui-border/40 border border-ui-border/60 px-5 py-2.5 rounded-full mr-3 mb-3",
                className
            )}
        >
            <Text className="text-[#CBD5E0] text-sm font-medium">
                {label}
            </Text>
        </TouchableOpacity>
    );
};
