import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "../../utils";

export interface UserProfileCardProps {
    name: string;
    email: string;
    profilePictureUrl?: string;
    className?: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
    name,
    email,
    profilePictureUrl,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-row items-center bg-white rounded-2xl p-4 mb-6",
                className
            )}
        >
            {/* Avatar */}
            <View className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-[#E5E7EB]">
                {profilePictureUrl ? (
                    <Image
                        source={{ uri: profilePictureUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center bg-primary">
                        <Text className="text-text-primary text-2xl font-bold">
                            {name.charAt(0)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-[#1F2937] text-lg font-bold mb-1">{name}</Text>
                <Text className="text-[#6B7280] text-sm">{email}</Text>
            </View>
        </View>
    );
};
