import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ScanProgressProps {
    progress: number; // 0 to 100
    statusText: string;
    onCancel?: () => void;
    className?: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
    progress,
    statusText,
    onCancel,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-1 bg-background-primary items-center justify-center px-6",
                className
            )}
        >
            <View className="relative w-64 h-64 items-center justify-center mb-8">
                {/* Progress Circle Placeholder (would use SVG in real impl) */}
                <View className="w-full h-full rounded-full border-4 border-ui-border items-center justify-center">
                    <View
                        className="absolute inset-0 rounded-full border-4 border-primary"
                        style={{
                            transform: [{ rotate: '0deg' }],
                            opacity: 0.8
                        }}
                    />
                    <Text className="text-text-primary text-6xl font-bold">{progress}%</Text>
                </View>
            </View>

            <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                Scanning Prescription
            </Text>
            <Text className="text-text-secondary text-base text-center mb-12">
                {statusText}
            </Text>

            {onCancel && (
                <TouchableOpacity onPress={onCancel} className="absolute bottom-12">
                    <Text className="text-text-tertiary text-base font-bold">Cancel Scan</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
