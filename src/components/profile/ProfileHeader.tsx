import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface ProfileHeaderProps {
    name: string;
    email: string;
    profilePictureUrl?: string;
    onEditPress?: () => void;
    className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    email,
    profilePictureUrl,
    onEditPress,
    className,
}) => {
    return (
        <View className={cn("items-center py-6", className)}>
            {/* Avatar with Edit Button */}
            <View className="relative mb-4">
                <View className="w-24 h-24 rounded-full bg-[#E8C4A0] items-center justify-center">
                    {profilePictureUrl ? (
                        <Image source={{ uri: profilePictureUrl }} className="w-full h-full rounded-full" />
                    ) : (
                        <Text className="text-text-primary text-4xl">👤</Text>
                    )}
                </View>

                {/* Edit Button */}
                {onEditPress && (
                    <TouchableOpacity
                        onPress={onEditPress}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#3B82F6] rounded-full items-center justify-center border-2 border-background-secondary"
                    >
                        <Text className="text-text-primary text-sm">✏️</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Name */}
            <Text className="text-text-primary text-2xl font-bold mb-1">{name}</Text>

            {/* Email */}
            <Text className="text-text-tertiary text-base">{email}</Text>
        </View>
    );
};
