import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { cn } from "../../utils";

export interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    primaryAction: {
        label: string;
        onPress: () => void;
        variant?: "danger" | "primary";
    };
    secondaryAction: {
        label: string;
        onPress: () => void;
    };
    onClose: () => void;
    className?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    primaryAction,
    secondaryAction,
    onClose,
    className,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/60 items-center justify-center px-6">
                <View
                    className={cn(
                        "bg-[#1A2E2C] border border-ui-border rounded-[32px] p-8 w-full max-w-sm items-center",
                        className
                    )}
                >
                    {/* Warning Icon */}
                    <View className="w-20 h-20 bg-red-500/10 rounded-full items-center justify-center mb-6">
                        <Text className="text-red-500 text-3xl">⚠️</Text>
                    </View>

                    {/* Title */}
                    <Text className="text-text-primary text-2xl font-bold text-center mb-4">
                        {title}
                    </Text>

                    {/* Message */}
                    <Text className="text-text-secondary text-base text-center mb-8 leading-6">
                        {message}
                    </Text>

                    {/* Actions */}
                    <View className="w-full">
                        <TouchableOpacity
                            onPress={primaryAction.onPress}
                            className={cn(
                                "rounded-2xl py-4 mb-4",
                                primaryAction.variant === "primary" ? "bg-primary" : "bg-[#E7011B]"
                            )}
                        >
                            <Text className="text-text-primary text-base font-bold text-center">
                                {primaryAction.label}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={secondaryAction.onPress}
                            className="bg-ui-border rounded-2xl py-4"
                        >
                            <Text className="text-text-secondary text-base font-bold text-center">
                                {secondaryAction.label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
