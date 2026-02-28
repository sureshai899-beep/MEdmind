import React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { cn } from "../../utils";
import { Icon } from "../ui/Icon";

export interface AdviceCardProps {
    title: string;
    message: string;
    variant?: "info" | "warning" | "success" | "critical";
    nextStep?: string;
    timeContext?: "immediate" | "soon" | "take-later" | "skip";
    onAction?: () => void;
    actionLabel?: string;
    className?: string;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({
    title,
    message,
    variant = "info",
    nextStep,
    timeContext,
    onAction,
    actionLabel,
    className,
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "warning":
                return {
                    container: "border-[#F59E0B]/30 bg-[#FFFBEB]",
                    icon: "⚠️",
                    accent: "#F59E0B",
                };
            case "success":
                return {
                    container: "border-[#10D9A5]/30 bg-[#F0FDF4]",
                    icon: "✅",
                    accent: "#10D9A5",
                };
            case "critical":
                return {
                    container: "border-red-500/30 bg-red-50",
                    icon: "🚨",
                    accent: "#EF4444",
                };
            default:
                return {
                    container: "border-primary/30 bg-blue-50",
                    icon: "ℹ️",
                    accent: "#3182CE",
                };
        }
    };

    const styles = getVariantStyles();

    const getTimeHint = () => {
        switch (timeContext) {
            case "immediate":
                return "Take it as soon as possible.";
            case "soon":
                return "Try to take it within the next hour.";
            case "take-later":
                return "Continue with your next scheduled dose.";
            case "skip":
                return "Skip this dose and wait for the next one.";
            default:
                return null;
        }
    };

    const timeHint = getTimeHint();

    return (
        <View
            className={cn(
                "p-5 rounded-2xl border flex-col",
                styles.container,
                className
            )}
        >
            <View className="flex-row items-start mb-3">
                <View className="mr-3 mt-1">
                    <Text className="text-2xl">{styles.icon}</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-text-primary text-lg font-bold mb-1">
                        {title}
                    </Text>
                    <Text className="text-text-secondary text-base leading-6">
                        {message}
                    </Text>
                </View>
            </View>

            {(nextStep || timeHint) && (
                <View className="bg-white/50 rounded-xl p-4 mb-4 border border-black/5">
                    <Text className="text-text-primary font-bold text-sm mb-1 uppercase tracking-wider">
                        Recommended Next Step:
                    </Text>
                    <Text className="text-text-secondary text-base italic">
                        {nextStep || timeHint}
                    </Text>
                </View>
            )}

            {onAction && actionLabel && (
                <TouchableOpacity
                    onPress={onAction}
                    className="w-full py-3 rounded-xl items-center justify-center flex-row"
                    style={{ backgroundColor: styles.accent }}
                >
                    <Icon name="phone" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">
                        {actionLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
