import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ConfirmationDialogBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const ConfirmationDialogBody: React.FC<ConfirmationDialogBodyProps> = ({
    children,
    className,
}) => {
    return (
        <View className={cn("bg-background-secondary p-6 rounded-b-3xl", className)}>
            {children}
        </View>
    );
};
