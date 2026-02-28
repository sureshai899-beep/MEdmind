import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface TabSwitchProps {
    tabs: string[];
    activeTab: number;
    onTabChange: (index: number) => void;
    className?: string;
}

export const TabSwitch: React.FC<TabSwitchProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className,
}) => {
    return (
        <View className={cn("flex-row bg-transparent border-b border-ui-border", className)}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onTabChange(index)}
                    className={cn(
                        "flex-1 py-3 items-center border-b-2",
                        activeTab === index
                            ? "border-[#3B82F6]"
                            : "border-transparent"
                    )}
                >
                    <Text
                        className={cn(
                            "text-base font-semibold",
                            activeTab === index
                                ? "text-[#3B82F6]"
                                : "text-text-tertiary"
                        )}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
