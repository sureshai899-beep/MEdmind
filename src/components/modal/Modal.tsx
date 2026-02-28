import React from "react";
import { View, Text, TouchableOpacity, Modal as RNModal } from "react-native";
import { cn } from "../../utils";

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    iconBg?: string;
    children?: React.ReactNode;
    showCloseButton?: boolean;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    description,
    icon,
    iconBg = "#5A5A3C",
    children,
    showCloseButton = true,
    className,
}) => {
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/70 justify-center items-center px-6">
                <View
                    className={cn(
                        "bg-background-primary rounded-3xl p-6 w-full max-w-md relative",
                        className
                    )}
                >
                    {/* Close Button */}
                    {showCloseButton && (
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-ui-border rounded-full items-center justify-center z-10"
                        >
                            <Text className="text-text-primary text-xl">✕</Text>
                        </TouchableOpacity>
                    )}

                    {/* Icon */}
                    {icon && (
                        <View className="items-center mb-6 mt-8">
                            <View
                                style={{ backgroundColor: iconBg }}
                                className="w-20 h-20 rounded-full items-center justify-center"
                            >
                                {icon}
                            </View>
                        </View>
                    )}

                    {/* Title */}
                    {title && (
                        <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                            {title}
                        </Text>
                    )}

                    {/* Description */}
                    {description && (
                        <Text className="text-text-secondary text-base text-center mb-6">
                            {description}
                        </Text>
                    )}

                    {/* Custom Content */}
                    {children}
                </View>
            </View>
        </RNModal>
    );
};
