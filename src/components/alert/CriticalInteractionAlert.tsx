import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking, Alert as RNAlert } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Icon } from "../ui/Icon";

export interface CriticalInteractionAlertProps {
    visible: boolean;
    title: string;
    description: string;
    medicationName?: string;
    interactionType?: 'drug-drug' | 'drug-food' | 'drug-alcohol';
    severity: 'critical' | 'high' | 'moderate';
    recommendations?: string[];
    doctorPhone?: string;
    onAcknowledge: () => void;
    onDismiss?: () => void;
}

export const CriticalInteractionAlert: React.FC<CriticalInteractionAlertProps> = ({
    visible,
    title,
    description,
    medicationName,
    interactionType = 'drug-drug',
    severity,
    recommendations = [],
    doctorPhone,
    onAcknowledge,
    onDismiss,
}) => {
    const [acknowledged, setAcknowledged] = useState(false);
    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        if (visible && severity === 'critical') {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        }
    }, [visible, severity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
    }));

    const handleCallDoctor = () => {
        if (doctorPhone) {
            Linking.openURL(`tel:${doctorPhone}`).catch(() => {
                RNAlert.alert('Error', 'Unable to make phone call');
            });
        } else {
            RNAlert.alert('No Doctor Contact', 'No doctor phone number available');
        }
    };

    const handleAcknowledge = () => {
        if (!acknowledged) {
            RNAlert.alert(
                'Confirm Acknowledgment',
                'By acknowledging, you confirm that you have read and understood this critical alert.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'I Understand',
                        style: 'destructive',
                        onPress: () => {
                            setAcknowledged(true);
                            onAcknowledge();
                        }
                    }
                ]
            );
        }
    };

    const getSeverityColor = () => {
        switch (severity) {
            case 'critical':
                return '#DC2626';
            case 'high':
                return '#EF4444';
            case 'moderate':
                return '#F59E0B';
            default:
                return '#EF4444';
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={false}
            onRequestClose={onDismiss}
        >
            <View style={[styles.container, { backgroundColor: getSeverityColor() }]}>
                {/* Warning Icon with Pulse Animation */}
                <Animated.View style={[styles.iconContainer, animatedStyle]}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>⚠️</Text>
                    </View>
                </Animated.View>

                {/* Alert Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>

                    {medicationName && (
                        <View style={styles.medicationBadge}>
                            <Icon name="pill" size={16} color="#FFFFFF" />
                            <Text style={styles.medicationText}>{medicationName}</Text>
                        </View>
                    )}

                    <Text style={styles.description}>{description}</Text>

                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                        <View style={styles.recommendationsContainer}>
                            <Text style={styles.recommendationsTitle}>What You Should Do:</Text>
                            {recommendations.map((rec, index) => (
                                <View key={index} style={styles.recommendationItem}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.recommendationText}>{rec}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        {doctorPhone && (
                            <TouchableOpacity
                                onPress={handleCallDoctor}
                                style={[styles.button, styles.callButton]}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Call Doctor</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={handleAcknowledge}
                            style={[styles.button, styles.acknowledgeButton]}
                            disabled={acknowledged}
                        >
                            {acknowledged ? (
                                <>
                                    <Icon name="checkmark-circle" size={20} color="#10D9A5" />
                                    <Text style={[styles.buttonText, styles.acknowledgedText]}>
                                        Acknowledged
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Icon name="checkmark" size={20} color="#0F1E1C" />
                                    <Text style={styles.buttonText}>I Understand</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Warning Footer */}
                    <View style={styles.footer}>
                        <Icon name="info" size={16} color="rgba(255, 255, 255, 0.7)" />
                        <Text style={styles.footerText}>
                            This is a critical health alert. Please consult your healthcare provider.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        marginBottom: 30,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    iconText: {
        fontSize: 60,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 500,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A202C',
        textAlign: 'center',
        marginBottom: 16,
    },
    medicationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 16,
        gap: 8,
    },
    medicationText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#4A5568',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    recommendationsContainer: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
    },
    recommendationsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 12,
    },
    recommendationItem: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 8,
    },
    bullet: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    recommendationText: {
        flex: 1,
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
    },
    actions: {
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    callButton: {
        backgroundColor: '#3182CE',
    },
    acknowledgeButton: {
        backgroundColor: '#10D9A5',
    },
    buttonText: {
        color: '#0F1E1C',
        fontSize: 16,
        fontWeight: 'bold',
    },
    acknowledgedText: {
        color: '#10D9A5',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        gap: 8,
    },
    footerText: {
        flex: 1,
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
    },
});
