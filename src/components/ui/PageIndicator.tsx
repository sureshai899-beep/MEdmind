import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface PageIndicatorProps {
    totalPages: number;
    currentPage: number;
    activeColor?: string;
    inactiveColor?: string;
    className?: string;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
    totalPages,
    currentPage,
    activeColor = "#10D9A5",
    inactiveColor = "#2D3748",
    className,
}) => {
    return (
        <View className={cn("flex-row justify-center items-center gap-2", className)}>
            {Array.from({ length: totalPages }).map((_, index) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: index === currentPage ? activeColor : inactiveColor,
                    }}
                    className="w-2 h-2 rounded-full"
                />
            ))}
        </View>
    );
};
