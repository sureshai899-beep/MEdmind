import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { cn } from "../../utils";

export interface SettingsItemProps {
    icon?: string;
    iconBg?: string;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
    variant?: "default" | "danger";
    className?: string;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
    icon,
    iconBg = "#2D3748",
    title,
    subtitle,
    rightElement,
    showChevron = false,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    onPress,
    variant = "default",
    className,
}) => {
    const Container = onPress ? TouchableOpacity : View;

    const titleColor = variant === "danger" ? "text-status-missed" : "text-white";

    return (
        <Container
            onPress={onPress}
            className={cn(
                "flex-row items-center py-4 px-4 bg-background-secondary rounded-2xl mb-3",
                onPress && "active:opacity-70",
                className
            )}
        >
            {/* Icon */}
            {icon && (
                <View
                    style={{ backgroundColor: iconBg }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                >
                    <Text className="text-2xl">{icon}</Text>
                </View>
            )}

            {/* Content */}
            <View className="flex-1">
                <Text className={cn("text-base font-semibold", titleColor)}>
                    {title}
                </Text>
                {subtitle && (
                    <Text className="text-text-secondary text-sm mt-1">{subtitle}</Text>
                )}
            </View>

            {/* Right Side */}
            {showSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: "#2D3748", true: "#10D9A5" }}
                    thumbColor="#FFFFFF"
                />
            ) : rightElement ? (
                <View>{rightElement}</View>
            ) : showChevron ? (
                <Text className="text-text-tertiary text-xl">›</Text>
            ) : null}
        </Container>
    );
};
