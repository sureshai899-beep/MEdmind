import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface ImmunizationRecordItemProps {
    name: string;
    doseInfo: string;
    date: string;
    status: "scheduled" | "overdue" | "completed";
    icon?: React.ReactNode;
    className?: string;
}

export const ImmunizationRecordItem: React.FC<ImmunizationRecordItemProps> = ({
    name,
    doseInfo,
    date,
    status,
    icon,
    className,
}) => {
    const statusConfig = {
        scheduled: {
            iconBg: "bg-[#3B82F6]",
            iconColor: "text-white",
            dateColor: "text-[#3B82F6]",
            dateLabel: "Scheduled:",
            defaultIcon: "📅",
        },
        overdue: {
            iconBg: "bg-status-missed",
            iconColor: "text-white",
            dateColor: "text-status-missed",
            dateLabel: "Overdue:",
            defaultIcon: "⚠",
        },
        completed: {
            iconBg: "bg-primary",
            iconColor: "text-white",
            dateColor: "text-text-tertiary",
            dateLabel: "Completed:",
            defaultIcon: "✓",
        },
    };

    const config = statusConfig[status];

    return (
        <View className={cn("flex-row py-4", className)}>
            {/* Timeline Icon */}
            <View className="items-center mr-4">
                <View
                    className={cn(
                        "w-10 h-10 rounded-full items-center justify-center",
                        config.iconBg
                    )}
                >
                    <Text className={cn("text-xl", config.iconColor)}>
                        {icon || config.defaultIcon}
                    </Text>
                </View>

                {/* Timeline Line (optional, for connecting items) */}
                <View className="flex-1 w-0.5 bg-ui-border mt-2" />
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-bold mb-1">{name}</Text>
                <Text className="text-text-secondary text-sm mb-1">{doseInfo}</Text>
                <Text className={cn("text-sm", config.dateColor)}>
                    {config.dateLabel} {date}
                </Text>
            </View>
        </View>
    );
};
