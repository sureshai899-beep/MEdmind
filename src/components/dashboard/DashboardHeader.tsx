import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "../../utils";

export interface DashboardHeaderProps {
    userName: string;
    greeting?: string;
    profilePictureUrl?: string;
    onAvatarPress?: () => void;
    className?: string;
}

import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userName,
    greeting = "Welcome back",
    profilePictureUrl,
    onAvatarPress,
    className,
}) => {
    const router = useRouter();

    return (
        <View className={cn("flex-row items-center justify-between mb-lg px-md", className)}>
            <View className="flex-1">
                <Text className="text-text-primary text-h1">Dashboard</Text>
                <Text className="text-text-secondary text-body-lg mt-xs font-medium">
                    {greeting}, {userName}.
                </Text>
            </View>

            {profilePictureUrl && (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onAvatarPress || (() => router.push('/(tabs)/profile' as any))}
                    className="w-12 h-12 rounded-full overflow-hidden bg-ui-border"
                >
                    <Image
                        source={{ uri: profilePictureUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};
