import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    title,
    children,
    className,
}) => {
    if (!visible) return null;

    return (
        <View className="absolute inset-0 z-50">
            {/* Backdrop */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                className="flex-1 bg-black/70"
            />

            {/* Bottom Sheet */}
            <View
                className={cn(
                    "bg-background-secondary rounded-t-3xl px-6 py-4",
                    className
                )}
            >
                {/* Handle */}
                <View className="items-center mb-4">
                    <View className="w-12 h-1 bg-ui-border rounded-full" />
                </View>

                {/* Title */}
                {title && (
                    <Text className="text-text-primary text-xl font-bold mb-4">{title}</Text>
                )}

                {/* Content */}
                {children}
            </View>
        </View>
    );
};
