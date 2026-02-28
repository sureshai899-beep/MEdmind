import React from "react";
import { View, Text, Image } from "react-native";
import { Button } from "./Button";

export interface IllustrationHeroProps {
    title: string;
    subtitle?: string;
    imageSource?: any; // require path
    ctaLabel?: string;
    onCtaPress?: () => void;
    className?: string;
}

export const IllustrationHero: React.FC<IllustrationHeroProps> = ({
    title,
    subtitle,
    imageSource,
    ctaLabel,
    onCtaPress,
    className = "",
}) => {
    return (
        <View className={`items-center px-6 py-10 ${className}`}>
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={{ width: 280, height: 280 }}
                    resizeMode="contain"
                    className="mb-8"
                />
            ) : (
                <View className="w-64 h-64 bg-[#1A2C28] rounded-3xl items-center justify-center mb-8 border border-[#2D3F3A]">
                    <View className="w-32 h-32 bg-[#2D3F3A] rounded-full opacity-50" />
                </View>
            )}

            <Text className="text-text-primary text-3xl font-bold text-center mb-3">
                {title}
            </Text>

            {subtitle && (
                <Text className="text-gray-400 text-base text-center mb-8 leading-6">
                    {subtitle}
                </Text>
            )}

            {ctaLabel && onCtaPress && (
                <Button variant="primary" size="lg" onPress={onCtaPress} className="w-full">
                    {ctaLabel}
                </Button>
            )}
        </View>
    );
};
