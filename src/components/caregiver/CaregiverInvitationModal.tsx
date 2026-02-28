import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { cn } from "../../utils";

export interface CaregiverInvitationModalProps {
    caregiverName: string;
    caregiverAvatar?: string;
    message?: string;
    permissions?: {
        icon: React.ReactNode;
        label: string;
        enabled: boolean;
        onToggle?: (enabled: boolean) => void;
    }[];
    footerNote?: string;
    learnMoreLink?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    onClose?: () => void;
    className?: string;
}

export const CaregiverInvitationModal: React.FC<CaregiverInvitationModalProps> = ({
    caregiverName,
    caregiverAvatar,
    message = "Accept to help manage their medication schedule.",
    permissions = [],
    footerNote,
    learnMoreLink,
    onAccept,
    onDecline,
    onClose,
    className,
}) => {
    return (
        <View className={cn("bg-primary/20 rounded-t-3xl p-6", className)}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text-primary text-xl font-bold">Caregiver Invitation</Text>
                {onClose && (
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-text-primary text-2xl">✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Avatar */}
            <View className="items-center mb-6">
                <View className="w-32 h-32 rounded-full bg-[#E8C4A0] items-center justify-center mb-4">
                    {caregiverAvatar ? (
                        <Image
                            source={{ uri: caregiverAvatar }}
                            className="w-full h-full rounded-full"
                        />
                    ) : (
                        <Text className="text-6xl">👤</Text>
                    )}
                </View>

                <Text className="text-text-primary text-xl font-bold mb-2">
                    {caregiverName} has invited you to be a caregiver
                </Text>
                <Text className="text-text-secondary text-center">{message}</Text>
            </View>

            {/* Permissions */}
            {permissions.length > 0 && (
                <View className="mb-6">
                    {permissions.map((permission, index) => (
                        <View
                            key={index}
                            className="flex-row items-center justify-between py-4 border-b border-ui-border"
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 bg-ui-border rounded-xl items-center justify-center mr-3">
                                    {permission.icon}
                                </View>
                                <Text className="text-text-primary text-base">{permission.label}</Text>
                            </View>

                            {permission.onToggle && (
                                <TouchableOpacity
                                    onPress={() => permission.onToggle?.(!permission.enabled)}
                                    className={cn(
                                        "w-12 h-7 rounded-full p-1",
                                        permission.enabled ? "bg-primary" : "bg-ui-border"
                                    )}
                                >
                                    <View
                                        className={cn(
                                            "w-5 h-5 rounded-full bg-white",
                                            permission.enabled ? "ml-auto" : ""
                                        )}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Footer Note */}
            {footerNote && (
                <Text className="text-text-tertiary text-sm text-center mb-6">
                    {footerNote}{" "}
                    {learnMoreLink && (
                        <Text className="text-primary">{learnMoreLink}</Text>
                    )}
                </Text>
            )}

            {/* Action Buttons */}
            <View className="gap-3">
                {onAccept && (
                    <TouchableOpacity
                        onPress={onAccept}
                        className="bg-primary py-4 rounded-2xl items-center"
                    >
                        <Text className="text-black text-base font-bold">Accept Invitation</Text>
                    </TouchableOpacity>
                )}

                {onDecline && (
                    <TouchableOpacity onPress={onDecline} className="py-4 items-center">
                        <Text className="text-status-missed text-base font-bold">
                            Decline Invitation
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
