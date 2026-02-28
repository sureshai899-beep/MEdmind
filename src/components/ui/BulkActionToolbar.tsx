import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface BulkActionToolbarProps {
    onMarkTaken: () => void;
    onArchive: () => void;
    onDelete: () => void;
    className?: string;
}

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
    onMarkTaken,
    onArchive,
    onDelete,
    className,
}) => {
    return (
        <View
            className={cn(
                "bg-background-primary/95 border-t border-ui-border px-8 pt-4 pb-10 flex-row justify-between items-center absolute bottom-0 left-0 right-0",
                className
            )}
        >
            <TouchableOpacity onPress={onMarkTaken} className="items-center">
                <View className="w-6 h-6 items-center justify-center mb-1">
                    <Text className="text-text-secondary text-xl font-bold">✓</Text>
                </View>
                <Text className="text-text-primary text-xs font-medium">Mark Taken</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onArchive} className="items-center">
                <View className="w-6 h-6 items-center justify-center mb-1">
                    <Text className="text-text-secondary text-lg">📥</Text>
                </View>
                <Text className="text-text-primary text-xs font-medium">Archive</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} className="items-center">
                <View className="w-6 h-6 items-center justify-center mb-1">
                    <Text className="text-red-500 text-xl font-bold">🗑</Text>
                </View>
                <Text className="text-red-500 text-xs font-medium">Delete</Text>
            </TouchableOpacity>
        </View>
    );
};
