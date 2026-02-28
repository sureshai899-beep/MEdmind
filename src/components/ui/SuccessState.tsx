import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SuccessStateProps {
    title: string;
    description: string;
    buttonLabel: string;
    onButtonPress: () => void;
    className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
    title,
    description,
    buttonLabel,
    onButtonPress,
    className,
}) => {
    return (
        <View className={cn("flex-1 bg-[#0A1614] items-center justify-center px-10", className)}>
            <View className="mb-12">
                <View className="w-32 h-32 bg-primary/10 rounded-full items-center justify-center">
                    <View className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-lg shadow-[#10D9A5]/50">
                        <Text className="text-text-primary text-4xl font-bold">✓</Text>
                    </View>
                </View>
            </View>

            <Text className="text-text-primary text-4xl font-bold text-center mb-6">
                {title}
            </Text>

            <Text className="text-text-secondary text-lg text-center leading-7 mb-20 px-4">
                {description}
            </Text>

            <TouchableOpacity
                onPress={onButtonPress}
                activeOpacity={0.8}
                className="w-full bg-primary py-5 rounded-2xl items-center justify-center absolute bottom-12"
            >
                <Text className="text-black text-xl font-bold">
                    {buttonLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
