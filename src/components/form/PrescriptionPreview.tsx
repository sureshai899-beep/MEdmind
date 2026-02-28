import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "../../utils";

export interface PrescriptionPreviewProps {
    imageUri: string;
    className?: string;
}

export const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
    imageUri,
    className,
}) => {
    return (
        <View className={cn("items-center mb-6", className)}>
            <View className="bg-background-tertiary rounded-2xl p-4 overflow-hidden">
                <Image
                    source={{ uri: imageUri }}
                    className="w-32 h-40"
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};
