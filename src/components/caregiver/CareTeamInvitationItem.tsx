import React, { useState } from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { cn } from "../../utils";
import { Icon, IconName } from "../ui/Icon";

export interface CareTeamInvitationItemProps {
    email: string;
    name?: string;
    relationship?: string;
    isEmergencyContact?: boolean;
    notificationPrefs?: {
        medications: boolean;
        alerts: boolean;
        reports: boolean;
    };
    status: 'pending' | 'active' | 'expired';
    onUpdateRelationship?: (rel: string) => void;
    onToggleEmergency?: (val: boolean) => void;
    onUpdateNotifications?: (prefs: any) => void;
    onResend?: () => void;
    onCancel?: () => void;
    className?: string;
}

export const CareTeamInvitationItem: React.FC<CareTeamInvitationItemProps> = ({
    email,
    name,
    relationship = 'Family',
    isEmergencyContact = false,
    notificationPrefs = { medications: true, alerts: true, reports: false },
    status,
    onUpdateRelationship,
    onToggleEmergency,
    onUpdateNotifications,
    onResend,
    onCancel,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusStyles = () => {
        switch (status) {
            case 'active':
                return { bg: 'bg-green-50', text: 'text-green-600', label: 'Active' };
            case 'expired':
                return { bg: 'bg-red-50', text: 'text-red-600', label: 'Expired' };
            default:
                return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Pending' };
        }
    };

    const statusStyle = getStatusStyles();

    return (
        <View
            className={cn(
                "bg-background-secondary border border-ui-border rounded-2xl p-4 mb-4",
                isEmergencyContact ? "border-orange-200 border-2" : "",
                className
            )}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsExpanded(!isExpanded)}
                className="flex-row justify-between items-start"
            >
                <View className="flex-1 mr-4">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-text-primary text-base font-bold mr-2" numberOfLines={1}>
                            {name || email}
                        </Text>
                        <View className={cn("px-2 py-0.5 rounded-full", statusStyle.bg)}>
                            <Text className={cn("text-[10px] font-bold uppercase", statusStyle.text)}>
                                {statusStyle.label}
                            </Text>
                        </View>
                        {isEmergencyContact && (
                            <View className="bg-orange-100 px-2 py-0.5 rounded-full ml-2">
                                <Text className="text-orange-600 text-[10px] font-bold uppercase">SOS</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-text-tertiary text-xs mb-1">{email}</Text>
                    <Text className="text-primary text-sm font-medium">{relationship}</Text>
                </View>

                <View className="items-end">
                    <Icon name={isExpanded ? "arrow-back" : "arrow-forward"} size={20} color="#A0AEC0" style={{ transform: [{ rotate: isExpanded ? '90deg' : '-90deg' }] }} />
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View className="mt-4 pt-4 border-t border-ui-border">
                    {/* Relationship Selection */}
                    <View className="mb-4">
                        <Text className="text-text-secondary text-xs font-bold uppercase mb-2">Relationship</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['Family', 'Doctor', 'Friend', 'Caregiver'].map((rel) => (
                                <TouchableOpacity
                                    key={rel}
                                    onPress={() => onUpdateRelationship?.(rel)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg border",
                                        relationship === rel ? "bg-primary/10 border-primary" : "border-ui-border"
                                    )}
                                >
                                    <Text className={cn("text-xs", relationship === rel ? "text-primary font-bold" : "text-text-tertiary")}>
                                        {rel}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Emergency Contact Toggle */}
                    <TouchableOpacity
                        onPress={() => onToggleEmergency?.(!isEmergencyContact)}
                        className="flex-row items-center justify-between mb-4 bg-background-primary p-3 rounded-xl border border-ui-border"
                    >
                        <View className="flex-row items-center">
                            <Icon name="warning" size={20} color={isEmergencyContact ? "#F59E0B" : "#A0AEC0"} style={{ marginRight: 10 }} />
                            <View>
                                <Text className="text-text-primary text-sm font-bold">Emergency Contact</Text>
                                <Text className="text-text-tertiary text-[10px]">Notify immediately for missed doses</Text>
                            </View>
                        </View>
                        <View className={cn("w-10 h-5 rounded-full p-0.5", isEmergencyContact ? "bg-[#F59E0B]" : "bg-ui-border")}>
                            <View className={cn("w-4 h-4 rounded-full bg-white", isEmergencyContact ? "ml-auto" : "")} />
                        </View>
                    </TouchableOpacity>

                    {/* Notification Preferences */}
                    <View className="mb-6">
                        <Text className="text-text-secondary text-xs font-bold uppercase mb-2">Notification Preferences</Text>
                        <View className="bg-background-primary rounded-xl border border-ui-border overflow-hidden">
                            {[
                                { key: 'medications', label: 'Medication Updates', icon: 'pill' },
                                { key: 'alerts', label: 'Safety Alerts', icon: 'warning' },
                                { key: 'reports', label: 'Weekly Reports', icon: 'stats' },
                            ].map((pref, idx) => (
                                <TouchableOpacity
                                    key={pref.key}
                                    onPress={() => onUpdateNotifications?.({ ...notificationPrefs, [pref.key]: !(notificationPrefs as any)[pref.key] })}
                                    className={cn(
                                        "flex-row items-center justify-between p-3",
                                        idx !== 2 ? "border-b border-ui-border" : ""
                                    )}
                                >
                                    <View className="flex-row items-center">
                                        <Icon name={pref.icon as IconName} size={18} color="#A0AEC0" style={{ marginRight: 10 }} />
                                        <Text className="text-text-primary text-sm">{(notificationPrefs as any)[pref.key] ? '✅' : '❌'} {pref.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-3">
                        {status === 'pending' && onResend && (
                            <TouchableOpacity onPress={onResend} className="flex-1 bg-primary/10 py-3 rounded-xl items-center">
                                <Text className="text-primary text-sm font-bold">Resend Invite</Text>
                            </TouchableOpacity>
                        )}
                        {onCancel && (
                            <TouchableOpacity onPress={onCancel} className="flex-1 bg-red-50 py-3 rounded-xl items-center">
                                <Text className="text-red-600 text-sm font-bold">Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};
