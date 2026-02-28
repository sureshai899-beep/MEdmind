import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share, Clipboard, Alert } from "react-native";
import { Icon } from "../ui/Icon";
import QRCode from 'react-native-qrcode-svg';

export interface CaregiverLinkCenterProps {
    visible: boolean;
    onClose: () => void;
    onGenerateCode?: (code: string, permissions: string[]) => void;
}

type PermissionType = 'view-only' | 'edit' | 'full-access';

export const CaregiverLinkCenter: React.FC<CaregiverLinkCenterProps> = ({
    visible,
    onClose,
    onGenerateCode,
}) => {
    const [trustCode, setTrustCode] = useState<string>('');
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [selectedPermission, setSelectedPermission] = useState<PermissionType>('view-only');
    const [timeRemaining, setTimeRemaining] = useState<string>('');

    const permissions = [
        {
            type: 'view-only' as PermissionType,
            label: 'View Only',
            description: 'Can view medications and schedules',
            icon: 'eye',
        },
        {
            type: 'edit' as PermissionType,
            label: 'Edit Access',
            description: 'Can modify medications and reminders',
            icon: 'edit',
        },
        {
            type: 'full-access' as PermissionType,
            label: 'Full Access',
            description: 'Complete control including settings',
            icon: 'shield-checkmark',
        },
    ];

    const generateTrustCode = () => {
        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        setTrustCode(code);
        setExpiresAt(expires);

        if (onGenerateCode) {
            const perms = getPermissionsList(selectedPermission);
            onGenerateCode(code, perms);
        }
    };

    const getPermissionsList = (type: PermissionType): string[] => {
        switch (type) {
            case 'view-only':
                return ['view_medications', 'view_schedule'];
            case 'edit':
                return ['view_medications', 'view_schedule', 'edit_medications', 'edit_reminders'];
            case 'full-access':
                return ['view_medications', 'view_schedule', 'edit_medications', 'edit_reminders', 'manage_settings', 'manage_caregivers'];
            default:
                return [];
        }
    };

    useEffect(() => {
        if (expiresAt) {
            const interval = setInterval(() => {
                const now = new Date();
                const diff = expiresAt.getTime() - now.getTime();

                if (diff <= 0) {
                    setTimeRemaining('Expired');
                    setTrustCode('');
                    setExpiresAt(null);
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeRemaining(`${hours}h ${minutes}m`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [expiresAt]);

    const handleCopyCode = async () => {
        if (trustCode) {
            await Clipboard.setString(trustCode);
            Alert.alert('Copied!', 'Trust code copied to clipboard');
        }
    };

    const handleShareCode = async () => {
        if (trustCode) {
            try {
                await Share.share({
                    message: `Join my Pillara Circle of Trust!\n\nTrust Code: ${trustCode}\n\nThis code expires in ${timeRemaining}.\n\nDownload Pillara and enter this code to become my caregiver.`,
                    title: 'Pillara Trust Code',
                });
            } catch (error) {
                console.error('Error sharing code:', error);
            }
        }
    };

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Circle of Trust</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color="#A0AEC0" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>
                    Invite trusted caregivers to help manage your medications
                </Text>

                {/* Permission Selection */}
                <View style={styles.permissionsContainer}>
                    <Text style={styles.sectionTitle}>Select Permission Level</Text>
                    {permissions.map((perm) => (
                        <TouchableOpacity
                            key={perm.type}
                            onPress={() => setSelectedPermission(perm.type)}
                            style={[
                                styles.permissionCard,
                                selectedPermission === perm.type && styles.permissionCardActive
                            ]}
                        >
                            <View style={styles.permissionHeader}>
                                <Icon
                                    name={perm.icon as any}
                                    size={24}
                                    color={selectedPermission === perm.type ? '#10D9A5' : '#A0AEC0'}
                                />
                                <View style={styles.permissionInfo}>
                                    <Text style={[
                                        styles.permissionLabel,
                                        selectedPermission === perm.type && styles.permissionLabelActive
                                    ]}>
                                        {perm.label}
                                    </Text>
                                    <Text style={styles.permissionDescription}>
                                        {perm.description}
                                    </Text>
                                </View>
                                {selectedPermission === perm.type && (
                                    <Icon name="checkmark-circle" size={24} color="#10D9A5" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Trust Code Display */}
                {trustCode ? (
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>Trust Code</Text>
                        <View style={styles.codeDisplay}>
                            <Text style={styles.codeText}>{trustCode}</Text>
                        </View>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={`pillara://join?code=${trustCode}&permissions=${selectedPermission}`}
                                size={140}
                                color="#10D9A5"
                                backgroundColor="transparent"
                            />
                        </View>

                        <View style={styles.expiryInfo}>
                            <Icon name="time" size={16} color="#F59E0B" />
                            <Text style={styles.expiryText}>
                                Expires in {timeRemaining}
                            </Text>
                        </View>

                        <View style={styles.codeActions}>
                            <TouchableOpacity
                                onPress={handleCopyCode}
                                style={[styles.codeActionButton, styles.copyButton]}
                            >
                                <Icon name="copy" size={20} color="#0F1E1C" />
                                <Text style={styles.codeActionText}>Copy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleShareCode}
                                style={[styles.codeActionButton, styles.shareButton]}
                            >
                                <Icon name="share" size={20} color="#FFFFFF" />
                                <Text style={[styles.codeActionText, { color: '#FFFFFF' }]}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={generateTrustCode}
                        style={styles.generateButton}
                    >
                        <Icon name="add" size={24} color="#0F1E1C" />
                        <Text style={styles.generateButtonText}>Generate Trust Code</Text>
                    </TouchableOpacity>
                )}

                {/* Info */}
                <View style={styles.infoBox}>
                    <Icon name="info" size={20} color="#10D9A5" />
                    <Text style={styles.infoText}>
                        Trust codes expire after 24 hours. Your caregiver must enter the code before it expires.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#0F1E1C',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#A0AEC0',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    permissionsContainer: {
        marginBottom: 24,
    },
    permissionCard: {
        backgroundColor: '#1A2E2A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#2D3748',
    },
    permissionCardActive: {
        borderColor: '#10D9A5',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
    },
    permissionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#A0AEC0',
        marginBottom: 4,
    },
    permissionLabelActive: {
        color: '#FFFFFF',
    },
    permissionDescription: {
        fontSize: 14,
        color: '#718096',
    },
    codeContainer: {
        backgroundColor: '#1A2E2A',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 14,
        color: '#A0AEC0',
        marginBottom: 12,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    codeDisplay: {
        backgroundColor: '#0F1E1C',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginBottom: 12,
    },
    codeText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#10D9A5',
        letterSpacing: 8,
    },
    expiryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    expiryText: {
        fontSize: 14,
        color: '#F59E0B',
        fontWeight: '600',
    },
    codeActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    codeActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    copyButton: {
        backgroundColor: '#10D9A5',
    },
    shareButton: {
        backgroundColor: '#3182CE',
    },
    codeActionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F1E1C',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10D9A5',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 20,
        gap: 8,
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F1E1C',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        borderRadius: 12,
        padding: 12,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#10D9A5',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#A0AEC0',
        lineHeight: 18,
    },
    qrContainer: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
    },
});
