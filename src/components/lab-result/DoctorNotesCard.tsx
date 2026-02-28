import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface DoctorNotesCardProps {
    notes: string;
    className?: string;
}

export const DoctorNotesCard: React.FC<DoctorNotesCardProps> = ({
    notes,
    className,
}) => {
    return (
        <View className={cn("", className)}>
            <Text className="text-text-primary text-lg font-bold mb-3">Doctor's Notes</Text>

            <View className="bg-primary/20 rounded-2xl p-4">
                <Text className="text-text-secondary text-sm leading-6">{notes}</Text>
            </View>
        </View>
    );
};
