import React from "react";
import { View, Text, Modal } from "react-native";
import { cn } from "../../utils";

export interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
    progress?: number; // 0 to 1
    className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    message = "Saving changes...",
    progress = 0.5,
    className,
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/40 items-center justify-center">
                <View
                    className={cn(
                        "bg-[#1A2E2C] border border-ui-border rounded-[32px] p-10 items-center w-72",
                        className
                    )}
                >
                    {/* Refresh Icon */}
                    <View className="mb-6">
                        <Text className="text-primary text-4xl font-bold">🔄</Text>
                    </View>

                    {/* Message */}
                    <Text className="text-text-primary text-xl font-bold mb-8 text-center px-2">
                        {message}
                    </Text>

                    {/* Progress Bar Container */}
                    <View className="w-full h-2 bg-ui-border rounded-full overflow-hidden">
                        <View
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
