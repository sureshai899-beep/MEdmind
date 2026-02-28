import React from "react";
import { Text } from "react-native";
import { cn } from "../../utils";

export interface SettingsSectionHeaderProps {
    label: string;
    className?: string;
}

export const SettingsSectionHeader: React.FC<SettingsSectionHeaderProps> = ({
    label,
    className,
}) => {
    return (
        <Text
            className={cn(
                "text-text-tertiary text-sm font-bold uppercase tracking-widest px-6 mt-8 mb-3",
                className
            )}
        >
            {label}
        </Text>
    );
};
