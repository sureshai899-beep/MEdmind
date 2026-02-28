import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ImageEditorActionsProps {
    onRotate?: () => void;
    onRetake?: () => void;
    onConfirm?: () => void;
    className?: string;
}

export const ImageEditorActions: React.FC<ImageEditorActionsProps> = ({
    onRotate,
    onRetake,
    onConfirm,
    className,
}) => {
    return (
        <View className={cn("py-6", className)}>
            {/* Rotate Button */}
            {onRotate && (
                <TouchableOpacity
                    onPress={onRotate}
                    className="flex-row items-center justify-center py-4 mb-4"
                >
                    <Text className="text-text-primary text-base mr-2">🔄</Text>
                    <Text className="text-text-primary text-base font-semibold">Rotate</Text>
                </TouchableOpacity>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3">
                {onRetake && (
                    <TouchableOpacity
                        onPress={onRetake}
                        className="flex-1 bg-ui-border py-4 rounded-2xl items-center"
                    >
                        <Text className="text-text-primary text-base font-bold">Retake</Text>
                    </TouchableOpacity>
                )}

                {onConfirm && (
                    <TouchableOpacity
                        onPress={onConfirm}
                        className="flex-1 bg-primary py-4 rounded-2xl items-center"
                    >
                        <Text className="text-black text-base font-bold">Confirm</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
