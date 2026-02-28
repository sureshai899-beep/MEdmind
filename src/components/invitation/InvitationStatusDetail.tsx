import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface InvitationStatusDetailProps {
    name: string;
    email: string;
    profilePictureUrl?: string;
    status: "pending" | "accepted" | "declined";
    sentDate: string;
    expiryNote?: string;
    className?: string;
}

export const InvitationStatusDetail: React.FC<InvitationStatusDetailProps> = ({
    name,
    email,
    profilePictureUrl,
    status,
    sentDate,
    expiryNote,
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
        <View className={cn("", className)}>
            {/* User Info */}
            <View className="flex-row items-center mb-6">
                <View className="w-16 h-16 rounded-full bg-background-tertiary items-center justify-center mr-4">
                    {profilePictureUrl ? (
                        <Text>Avatar</Text>
                    ) : (
                        <Text className="text-text-primary text-2xl">👤</Text>
                    )}
                </View>

                <View className="flex-1">
                    <Text className="text-text-primary text-lg font-bold mb-1">{name}</Text>
                    <Text className="text-text-tertiary text-sm">{email}</Text>
                </View>
            </View>

            {/* Status and Date */}
            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-text-tertiary text-sm">Status</Text>
                    <View
                        className={cn(
                            "px-3 py-1 rounded-full flex-row items-center",
                            config.bg
                        )}
                    >
                        <Text className={cn("text-sm font-bold", config.text)}>
                            {config.icon} {config.label}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between items-center py-4 border-t border-b border-ui-border">
                    <Text className="text-text-tertiary text-sm">Sent on</Text>
                    <Text className="text-text-primary text-sm">{sentDate}</Text>
                </View>
            </View>

            {/* Expiry Note */}
            {expiryNote && (
                <Text className="text-text-secondary text-sm text-center">{expiryNote}</Text>
            )}
        </View>
    );
};
