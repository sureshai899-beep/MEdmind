import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "../../utils";

export interface ImageCropperProps {
    imageUri: string;
    instruction?: string;
    className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
    imageUri,
    instruction = "Drag the handles to crop the prescription",
    className,
}) => {
    return (
        <View className={cn("flex-1", className)}>
            {/* Instruction */}
            {instruction && (
                <Text className="text-text-secondary text-center mb-4">{instruction}</Text>
            )}

            {/* Crop Area */}
            <View className="flex-1 bg-ui-border rounded-2xl overflow-hidden relative">
                {/* Image Preview */}
                <View className="absolute inset-0 items-center justify-center">
                    <View className="w-full h-full border-4 border-[#3B82F6] rounded-lg">
                        {/* Corner Handles */}
                        {[
                            "top-0 left-0",
                            "top-0 right-0",
                            "bottom-0 left-0",
                            "bottom-0 right-0",
                        ].map((position, index) => (
                            <View
                                key={index}
                                className={cn(
                                    "absolute w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white",
                                    position
                                )}
                            />
                        ))}

                        {/* Edge Handles */}
                        {[
                            "top-1/2 left-0 -translate-y-1/2",
                            "top-1/2 right-0 -translate-y-1/2",
                            "top-0 left-1/2 -translate-x-1/2",
                            "bottom-0 left-1/2 -translate-x-1/2",
                        ].map((position, index) => (
                            <View
                                key={`edge-${index}`}
                                className={cn(
                                    "absolute w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white",
                                    position
                                )}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};
