import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ProfileItemProps {
    name: string;
    role: string;
    profilePictureUrl?: string;
    isActive?: boolean;
    isSelected?: boolean;
    isPending?: boolean;
    onPress?: () => void;
    className?: string;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
    name,
    role,
    profilePictureUrl,
    isActive = false,
    isSelected = false,
    isPending = false,
    onPress,
    className,
}) => {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className={cn(
                "flex-row items-center p-4 rounded-2xl border mb-3",
                isSelected
                    ? "bg-primary/20 border-primary"
                    : "bg-background-secondary border-ui-border",
                className
            )}
        >
            {/* Avatar */}
            <View className="w-14 h-14 rounded-full overflow-hidden bg-ui-border mr-4">
                {profilePictureUrl ? (
                    <Image
                        source={{ uri: profilePictureUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center">
                        <Text className="text-text-primary text-lg font-bold">
                            {getInitials(name)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-text-primary text-base font-semibold">{name}</Text>
                <Text className="text-text-secondary text-sm mt-1">
                    {role}
                    {isPending && " (Pending)"}
                </Text>
            </View>

            {/* Status & Selection */}
            <View className="flex-row items-center gap-3">
                {/* Active Status Dot */}
                <View
                    className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        isActive ? "bg-primary" : isPending ? "bg-text-tertiary" : "bg-status-missed"
                    )}
                />

                {/* Selection Indicator */}
                <View
                    className={cn(
                        "w-6 h-6 rounded-full border-2 items-center justify-center",
                        isSelected ? "border-primary bg-primary" : "border-ui-border"
                    )}
                >
                    {isSelected && (
                        <Text className="text-text-primary text-xs font-bold">✓</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};
