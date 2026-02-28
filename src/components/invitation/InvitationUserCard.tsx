import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface InvitationUserCardProps {
    name: string;
    email: string;
    profilePictureUrl?: string;
    status: "pending" | "accepted" | "declined";
    sentDate?: string;
    className?: string;
}

export const InvitationUserCard: React.FC<InvitationUserCardProps> = ({
    name,
    email,
    profilePictureUrl,
    status,
    sentDate,
    className,
}) => {
    const statusConfig = {
        pending: {
            bg: "bg-status-next/20",
            text: "text-status-next",
            label: "Pending",
            icon: "⏳",
        },
        accepted: {
            bg: "bg-primary/20",
            text: "text-primary",
            label: "Accepted",
            icon: "✓",
        },
        declined: {
            bg: "bg-status-missed/20",
            text: "text-status-missed",
            label: "Declined",
            icon: "✕",
        },
    };

    const config = statusConfig[status];

    return (
        <View className={cn("items-center py-6", className)}>
            {/* Status Badge */}
            <View
                className={cn(
                    "px-4 py-2 rounded-full flex-row items-center mb-6",
                    config.bg
                )}
            >
                <Text className={cn("text-sm font-bold", config.text)}>
                    {config.icon} {config.label}
                </Text>
            </View>

            {/* Avatar */}
            <View className="w-20 h-20 rounded-full bg-ui-border items-center justify-center mb-4">
                {profilePictureUrl ? (
                    <Text>Avatar</Text>
                ) : (
                    <Text className="text-text-primary text-2xl font-bold">
                        {name.charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>

            {/* Name */}
            <Text className="text-text-primary text-xl font-bold mb-2">{name}</Text>

            {/* Email */}
            <Text className="text-text-tertiary text-base mb-6">{email}</Text>

            {/* Sent Date */}
            {sentDate && (
                <View className="flex-row items-center justify-between w-full px-6 py-4 border-t border-b border-ui-border">
                    <Text className="text-text-tertiary text-sm">Sent on</Text>
                    <Text className="text-text-primary text-sm">{sentDate}</Text>
                </View>
            )}

            {/* Notification Text */}
            <Text className="text-text-secondary text-sm text-center mt-6">
                We'll notify you once they accept.
            </Text>
        </View>
    );
};
