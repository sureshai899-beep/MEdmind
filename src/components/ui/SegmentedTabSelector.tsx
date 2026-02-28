import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface SegmentedTabSelectorProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    className?: string;
}

export const SegmentedTabSelector: React.FC<SegmentedTabSelectorProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className,
}) => {
    return (
        <View className={cn("flex-row w-full border-b border-ui-border/30 mb-8", className)}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => onTabChange(tab)}
                    activeOpacity={0.8}
                    className={cn(
                        "flex-1 items-center py-4 border-b-2 border-transparent",
                        activeTab === tab && "border-[#3182CE]"
                    )}
                >
                    <Text
                        className={cn(
                            "text-lg font-bold",
                            activeTab === tab ? "text-[#3182CE]" : "text-text-tertiary"
                        )}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
