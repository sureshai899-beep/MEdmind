import React from "react";
import { View } from "react-native";
import { cn } from "../../utils";

export interface ScanStepIndicatorProps {
    totalSteps?: number;
    currentStep: number;
    className?: string;
}

export const ScanStepIndicator: React.FC<ScanStepIndicatorProps> = ({
    totalSteps = 3,
    currentStep,
    className,
}) => {
    return (
        <View className={cn("flex-row justify-center items-center px-20 gap-2 mb-8", className)}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                    className={cn(
                        "h-1.5 flex-1 rounded-full",
                        index < currentStep ? "bg-primary" : "bg-[#1A2E2C]"
                    )}
                />
            ))}
        </View>
    );
};
