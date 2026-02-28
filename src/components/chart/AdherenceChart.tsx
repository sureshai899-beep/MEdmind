import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { cn } from "../../utils";

export interface AdherenceChartProps {
    data: {
        day: string;
        percentage: number;
        isCurrent?: boolean;
    }[];
    title?: string;
    subtitle?: string;
    legendItems?: { label: string; color: string }[];
    className?: string;
}

export const AdherenceChart: React.FC<AdherenceChartProps> = ({
    data,
    title = "Adherence Trends",
    subtitle = "Last 7 Days",
    legendItems = [
        { label: "Taken", color: "#10D9A5" },
        { label: "Expected", color: "#2D3748" },
    ],
    className,
}) => {
    const maxPercentage = 100;

    return (
        <View className={cn("py-4", className)}>
            {/* Header */}
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-text-primary text-lg font-bold">{title}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                        <TouchableOpacity className="bg-primary/20 px-2 py-0.5 rounded">
                            <Text className="text-primary text-[10px] font-bold">WEEKLY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-background-tertiary px-2 py-0.5 rounded">
                            <Text className="text-text-tertiary text-[10px] font-bold">MONTHLY</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Legend */}
                <View className="flex-row gap-4">
                    {legendItems.map((item, index) => (
                        <View key={index} className="flex-row items-center">
                            <View
                                style={{ backgroundColor: item.color }}
                                className="w-3 h-3 rounded-full mr-2"
                            />
                            <Text className="text-text-secondary text-xs">{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Y-Axis Labels */}
            <View className="flex-row mb-2">
                <View className="w-12">
                    {[100, 50, 0].map((value, index) => (
                        <Text
                            key={index}
                            className="text-text-tertiary text-xs text-right"
                            style={{ height: 40 }}
                        >
                            {value}%
                        </Text>
                    ))}
                </View>

                {/* Chart Area */}
                <View className="flex-1 ml-4">
                    <View className="h-40 flex-row items-end justify-between border-b border-ui-border">
                        {data.map((item, index) => {
                            const height = (item.percentage / maxPercentage) * 100;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    className="flex-1 items-center"
                                    onPress={() => Alert.alert(`${item.day} Adherence`, `${item.percentage}% of doses taken.`)}
                                >
                                    {/* Bar Container */}
                                    <View className="w-full px-2 items-end flex-1 justify-end">
                                        <View
                                            style={{ height: `${height}%` }}
                                            className={cn(
                                                "w-full rounded-t-lg",
                                                item.percentage >= 80 ? "bg-[#10D9A5]" :
                                                    item.percentage >= 50 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                                            )}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* X-Axis Labels */}
                    <View className="flex-row justify-between mt-2">
                        {data.map((item, index) => (
                            <Text
                                key={index}
                                className={cn(
                                    "flex-1 text-center text-xs",
                                    item.isCurrent ? "text-white font-bold" : "text-text-tertiary"
                                )}
                            >
                                {item.day}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};
