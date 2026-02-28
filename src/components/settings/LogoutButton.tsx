import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "../../utils";

export interface LogoutButtonProps {
    onPress: () => void;
    className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    onPress,
    className,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={cn(
                "bg-background-secondary/50 border border-ui-border rounded-[24px] py-5 items-center justify-center",
                className
            )}
        >
            <Text className="text-[#E7011B] text-lg font-bold">Log Out</Text>
        </TouchableOpacity>
    );
};
