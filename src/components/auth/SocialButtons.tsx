import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/Colors";
import { cn } from "../../utils";
import { Icon } from "../ui/Icon";

interface SocialButtonProps {
    onPress: () => void;
    icon: React.ReactNode;
    label: string;
    className?: string;
    variant?: "google" | "phone";
}

export const SocialButton: React.FC<SocialButtonProps> = ({
    onPress,
    icon,
    label,
    className,
    variant = "google",
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={cn(
                "flex-row items-center justify-center py-4 px-6 rounded-xl border w-full",
                variant === "google" ? "bg-white border-gray-200" : "bg-background-secondary border-ui-border",
                className
            )}
        >
            <View className="mr-3">
                {icon}
            </View>
            <Text className={cn(
                "font-bold text-base",
                variant === "google" ? "text-gray-800" : "text-text-primary"
            )}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

interface SocialButtonsProps {
    onGooglePress: () => void;
    onPhonePress: () => void;
    className?: string;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
    onGooglePress,
    onPhonePress,
    className,
}) => {
    return (
        <View className={cn("w-full space-y-3", className)}>

            <SocialButton
                onPress={onGooglePress}
                icon={<Icon name="logo-google" size={24} />}
                label="Sign in with Google"
                variant="google"
            />

            <SocialButton
                onPress={onPhonePress}
                icon={<Icon name="phone" size={24} color={colors.text.primary} />}
                label="Sign in with Phone"
                variant="phone"
                className="mt-3"
            />
        </View>
    );
};
