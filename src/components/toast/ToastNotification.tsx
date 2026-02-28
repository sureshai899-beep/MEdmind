import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ToastNotificationProps {
    title: string;
    message: string;
    type?: "error" | "warning" | "success";
    onClose?: () => void;
    className?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
    title,
    message,
    type = "error",
    onClose,
    className,
}) => {
    const bgClass = type === "error" ? "bg-[#E7011B]" : "bg-ui-border";

    const icon = type === "error" ? "❗" : "ℹ️";

    return (
        <View
            className={cn(
                "rounded-2xl p-4 flex-row items-center shadow-lg mb-3 mx-4",
                bgClass,
                className
            )}
        >
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4">
                <Text className="text-text-primary text-lg">{icon}</Text>
            </View>

            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold">{title}</Text>
                <Text className="text-text-primary/80 text-sm">{message}</Text>
            </View>

            {onClose && (
                <TouchableOpacity onPress={onClose} className="ml-4 p-2">
                    <Text className="text-text-primary/60 text-lg">✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
