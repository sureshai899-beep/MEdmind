import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ListItemProps {
    icon?: React.ReactNode;
    iconBg?: string;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
    icon,
    iconBg = "#243832",
    title,
    subtitle,
    rightElement,
    onPress,
    className,
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            className={cn(
                "flex-row items-center py-3 px-4 rounded-xl mb-2",
                onPress && "active:opacity-70",
                className
            )}
        >
            {icon && (
                <View
                    style={{ backgroundColor: iconBg }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                >
                    {typeof icon === 'string' ? (
                        <Text className="text-2xl">{icon}</Text>
                    ) : (
                        icon
                    )}
                </View>
            )}

            <View className="flex-1">
                <Text className="text-text-primary text-base font-semibold">{title}</Text>
                {subtitle && (
                    <Text className="text-primary text-sm mt-1">{subtitle}</Text>
                )}
            </View>

            {rightElement && <View className="ml-2">{rightElement}</View>}

            {onPress && !rightElement && (
                <Text className="text-text-tertiary text-xl ml-2">›</Text>
            )}
        </Container>
    );
};
