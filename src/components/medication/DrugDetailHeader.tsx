import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "../ui/StatusBadge";

export interface DrugDetailHeaderProps {
    name: string;
    genericName?: string;
    dosageForm?: string;
    dosage?: string;
    status?: "taken" | "next" | "missed" | "pending" | "warning";
    onBack?: () => void;
    className?: string;
}

export const DrugDetailHeader: React.FC<DrugDetailHeaderProps> = ({
    name,
    genericName,
    dosageForm,
    dosage,
    status,
    onBack,
    className = "",
}) => {
    return (
        <View className={`bg-[#0F1D1A] pt-4 pb-6 px-4 border-b border-[#1A2C28] ${className}`}>
            {onBack && (
                <TouchableOpacity onPress={onBack} className="mb-4 w-10 h-10 items-center justify-center rounded-full bg-[#1A2C28]">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            )}

            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                    <Text className="text-text-primary text-3xl font-bold mb-1">{name}</Text>
                    {genericName && (
                        <Text className="text-gray-400 text-base font-medium">{genericName}</Text>
                    )}
                </View>
                {status && <StatusBadge status={status} />}
            </View>

            {(dosageForm || dosage) && (
                <View className="flex-row items-center bg-[#1A2C28] self-start px-3 py-1.5 rounded-lg">
                    <Text className="text-gray-300 text-sm">
                        {dosageForm}
                        {dosageForm && dosage ? " • " : ""}
                        {dosage}
                    </Text>
                </View>
            )}
        </View>
    );
};
