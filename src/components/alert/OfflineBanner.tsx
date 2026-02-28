import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface OfflineBannerProps {
    title: string;
    message: string;
    onViewDetails: () => void;
    className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
    title,
    message,
    onViewDetails,
    className,
}) => {
    return (
        <View
            className={cn(
                "bg-[#2C2916] border border-[#BC9D20]/40 rounded-2xl p-5 mb-8",
                className
            )}
        >
            <Text className="text-[#E9D558] text-base font-bold mb-1">
                {title}
            </Text>
            <Text className="text-[#E9D558]/80 text-sm mb-4 leading-5">
                {message}
            </Text>
            <TouchableOpacity onPress={onViewDetails} className="flex-row items-center">
                <Text className="text-[#E9D558] text-sm font-bold mr-2">
                    View Details
                </Text>
                <Text className="text-[#E9D558] text-sm">→</Text>
            </TouchableOpacity>
        </View>
    );
};
