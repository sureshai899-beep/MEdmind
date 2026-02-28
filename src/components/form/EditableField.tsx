import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface EditableFieldProps {
    label: string;
    value: string;
    onEdit?: () => void;
    color?: string;
    editable?: boolean;
    className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    onEdit,
    color,
    editable = true,
    className,
}) => {
    return (
        <View className={cn("mb-4", className)}>
            <Text className="text-text-secondary text-sm mb-2">{label}</Text>

            <View className="flex-row items-center justify-between bg-background-secondary rounded-xl px-4 py-3 border border-ui-border">
                <View className="flex-row items-center flex-1">
                    <View
                        style={{ backgroundColor: color || '#10D9A5' }}
                        className="w-2 h-2 rounded-full mr-3"
                    />
                    <Text className="text-text-primary text-base">{value}</Text>
                </View>

                {editable && onEdit && (
                    <TouchableOpacity onPress={onEdit} className="ml-3">
                        <Text className="text-primary text-xl">✏</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
