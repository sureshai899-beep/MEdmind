import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface CaregiverActionFooterProps {
    primaryActionLabel: string;
    onPrimaryAction: () => void;
    secondaryActionLabel: string;
    onSecondaryAction: () => void;
    className?: string;
}

export const CaregiverActionFooter: React.FC<CaregiverActionFooterProps> = ({
    primaryActionLabel,
    onPrimaryAction,
    secondaryActionLabel,
    onSecondaryAction,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-row w-full gap-4 px-6 py-8 bg-black/60",
                className
            )}
        >
            <TouchableOpacity
                onPress={onSecondaryAction}
                activeOpacity={0.8}
                className="flex-1 bg-[#1A2E2C] py-4 rounded-full flex-row items-center justify-center border border-ui-border/30"
            >
                <Text className="text-xl mr-2">🔔</Text>
                <Text className="text-[#3182CE] text-lg font-bold">
                    {secondaryActionLabel}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onPrimaryAction}
                activeOpacity={0.8}
                className="flex-[1.2] bg-[#3182CE] py-4 rounded-full flex-row items-center justify-center"
            >
                <Text className="text-xl mr-2 text-text-primary">+</Text>
                <Text className="text-text-primary text-lg font-bold">
                    {primaryActionLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
