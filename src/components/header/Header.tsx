import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface HeaderProps {
    title: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-row items-center justify-between px-4 py-4 bg-background-primary",
                className
            )}
        >
            {/* Left Icon */}
            <View className="w-10">
                {leftIcon && (
                    <View className="items-start">{leftIcon}</View>
                )}
            </View>

            {/* Title */}
            <Text className="text-text-primary text-xl font-bold flex-1 text-center">
                {title}
            </Text>

            {/* Right Icon */}
            <View className="w-10">
                {rightIcon && (
                    <View className="items-end">{rightIcon}</View>
                )}
            </View>
        </View>
    );
};
