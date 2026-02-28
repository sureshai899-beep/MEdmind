import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SocialLoginButtonProps {
    provider: "google" | "apple" | "facebook";
    onPress: () => void;
    className?: string;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
    provider,
    onPress,
    className,
}) => {
    const providerConfig = {
        google: {
            icon: "G",
            text: "Continue with Google",
            bg: "bg-white",
            textColor: "text-black",
        },
        apple: {
            icon: "",
            text: "Continue with Apple",
            bg: "bg-black",
            textColor: "text-white",
        },
        facebook: {
            icon: "f",
            text: "Continue with Facebook",
            bg: "bg-[#1877F2]",
            textColor: "text-white",
        },
    };

    const config = providerConfig[provider];

    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                "flex-row items-center justify-center rounded-xl py-3 px-4",
                config.bg,
                className
            )}
        >
            <Text className={cn("text-xl mr-3", config.textColor)}>
                {config.icon}
            </Text>
            <Text className={cn("text-base font-semibold", config.textColor)}>
                {config.text}
            </Text>
        </TouchableOpacity>
    );
};
