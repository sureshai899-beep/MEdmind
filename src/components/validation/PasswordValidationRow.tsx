import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export type ValidationStatus = "success" | "error" | "pending";

export interface PasswordValidationRowProps {
    label: string;
    status: ValidationStatus;
    className?: string;
}

export const PasswordValidationRow: React.FC<PasswordValidationRowProps> = ({
    label,
    status,
    className,
}) => {
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <View className={cn("flex-row items-center mb-3", className)}>
            <View
                className={cn(
                    "w-5 h-5 rounded-md items-center justify-center mr-3",
                    isSuccess ? "bg-primary" : isError ? "bg-transparent border border-status-missed/50" : "bg-transparent border border-ui-border"
                )}
            >
                {isSuccess && <Text className="text-black text-[10px] font-bold">✓</Text>}
                {isError && (
                    <>
                        <View className="w-2.5 h-0.5 bg-status-missed rotate-45 absolute" />
                        <View className="w-2.5 h-0.5 bg-status-missed -rotate-45 absolute" />
                    </>
                )}
            </View>
            <Text
                className={cn(
                    "text-base",
                    isSuccess ? "text-text-secondary" : isError ? "text-status-missed" : "text-text-tertiary"
                )}
            >
                {label}
            </Text>
        </View>
    );
};
