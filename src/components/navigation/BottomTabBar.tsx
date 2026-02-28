import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Icon, IconName } from "../ui/Icon";
import { colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type { BottomTabBarProps };

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-row bg-background-primary border-t border-[#233532] pt-3 px-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Map route names to icon names
                let iconName: IconName = "home";
                if (route.name === "index") iconName = "home";
                if (route.name === "medications") iconName = "pill";
                if (route.name === "logs") iconName = "stats";
                if (route.name === "community") iconName = "people";
                if (route.name === "profile") iconName = "person";

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel || `${label} tab`}
                        testID={(options as any).tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className="flex-1 items-center justify-center"
                    >
                        <View className={cn(
                            "w-12 h-12 rounded-2xl items-center justify-center mb-1 transition-all",
                            isFocused ? "bg-[#1A4D45]/40" : "bg-transparent"
                        )}>
                            <Icon
                                name={iconName}
                                size={24}
                                color={isFocused ? colors.primary.DEFAULT : colors.text.tertiary}
                            />
                        </View>
                        <Text
                            className={cn(
                                "text-[10px] font-bold tracking-wider",
                                isFocused ? "text-primary" : "text-text-tertiary/60"
                            )}
                        >
                            {String(label).toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
