import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    FadeInUp
} from 'react-native-reanimated';
import { Icon } from '../../components/ui/Icon';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/Colors';

export function EmergencyEscalationScreen() {
    const router = useRouter();
    const pulseAnim = useSharedValue(1);

    React.useEffect(() => {
        pulseAnim.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
    }));

    const handleCallCaregiver = () => {
        Linking.openURL('tel:911'); // Placeholder for emergency
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Icon name="close" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.View style={[styles.alertIconContainer, animatedStyle]}>
                    <View style={styles.iconCircle}>
                        <Icon name="warning" size={80} color={colors.status.critical} />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.textContainer}>
                    <Text style={styles.title}>Critical Missed Doses</Text>
                    <Text style={styles.subtitle}>
                        Multiple critical doses have been missed for <Text style={styles.medName}>Warfarin</Text>.
                        Escalating to your primary caregiver.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.caregiverCard}>
                    <View style={styles.caregiverInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="person" size={32} color={colors.text.primary} />
                        </View>
                        <View>
                            <Text style={styles.caregiverName}>Dr. Sarah Wilson</Text>
                            <Text style={styles.caregiverRole}>Primary Caregiver</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.callButton}
                        onPress={handleCallCaregiver}
                    >
                        <Icon name="phone" size={24} color={colors.text.primary} />
                        <Text style={styles.callButtonText}>Dial Caregiver</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.adviceContainer}>
                    <Text style={styles.adviceTitle}>Safety Advice:</Text>
                    <Text style={styles.adviceText}>
                        • Do not take a double dose to make up for the missed one.{"\n"}
                        • Check for signs of unusual bruising or bleeding.{"\n"}
                        • Sit down and rest until you speak with your doctor.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.emergencyButton}
                    onPress={() => Linking.openURL('tel:911')}
                >
                    <Text style={styles.emergencyButtonText}>Call Emergency Services (911)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.status.emergency, // Deep red for urgency
    },
    header: {
        padding: 20,
        alignItems: 'flex-end',
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: `${colors.text.primary}33`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertIconContainer: {
        marginBottom: 40,
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.text.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: colors.text.primary,
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        color: `${colors.text.primary}E6`, // 90% opacity
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 26,
    },
    medName: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    caregiverCard: {
        backgroundColor: colors.text.primary,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    caregiverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.text.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    caregiverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A202C',
    },
    caregiverRole: {
        fontSize: 14,
        color: '#718096',
    },
    callButton: {
        backgroundColor: '#3182CE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
    },
    callButtonText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    adviceContainer: {
        marginTop: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 16,
        width: '100%',
    },
    adviceTitle: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    adviceText: {
        color: `${colors.text.primary}CC`, // 80% opacity
        fontSize: 14,
        lineHeight: 22,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    emergencyButton: {
        backgroundColor: '#000000',
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    emergencyButtonText: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: '900',
    },
});
