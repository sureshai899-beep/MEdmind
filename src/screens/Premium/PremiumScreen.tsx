import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../../components/ui/Icon';
import { SUBSCRIPTION_PLANS, paymentService } from '../../services/paymentService';
import { useProfile } from '../../hooks/useProfile';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export function PremiumScreen() {
    const router = useRouter();
    const { setPremiumStatus, profile } = useProfile();
    const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1].id);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            const result = await paymentService.processPayment(selectedPlan);

            if (result.success) {
                await setPremiumStatus(true);
                Alert.alert(
                    'Welcome to Premium!',
                    'Your subscription is now active. Enjoy all premium features.',
                    [{ text: 'Awesome', onPress: () => router.back() }]
                );
            } else {
                Alert.alert('Payment Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upgrade to Premium</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(800)} style={styles.heroSection}>
                    <View style={styles.crownContainer}>
                        <Icon name="star" size={40} color="#FFD700" />
                    </View>
                    <Text style={styles.heroTitle}>Unlock Full Potential</Text>
                    <Text style={styles.heroSubtitle}>Get medical-grade insights and advanced tracking features.</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.featuresContainer}>
                    <FeatureItem
                        icon="scan"
                        title="Unlimited AI Scanning"
                        description="Scan any prescription or lab report instantly."
                    />
                    <FeatureItem
                        icon="shield-checkmark"
                        title="Interaction Alerts"
                        description="Real-time warning for conflicting medications."
                    />
                    <FeatureItem
                        icon="people"
                        title="Caregiver Sharing"
                        description="Share your health logs with doctors or family."
                    />
                    <FeatureItem
                        icon="cloud-upload"
                        title="Cloud Sync"
                        description="Securely backup your logs across all devices."
                    />
                </Animated.View>

                <View style={styles.plansContainer}>
                    {SUBSCRIPTION_PLANS.map((plan, index) => (
                        <TouchableOpacity
                            key={plan.id}
                            onPress={() => setSelectedPlan(plan.id)}
                            style={[
                                styles.planCard,
                                selectedPlan === plan.id && styles.planCardActive,
                                plan.isPopular && styles.planCardPopular
                            ]}
                            activeOpacity={0.9}
                        >
                            {plan.isPopular && (
                                <View style={styles.popularBadge}>
                                    <Text style={styles.popularText}>BEST VALUE</Text>
                                </View>
                            )}
                            <View style={styles.planHeader}>
                                <View>
                                    <Text style={styles.planName}>{plan.name}</Text>
                                    <Text style={styles.planDesc}>{plan.description}</Text>
                                </View>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>{plan.price}</Text>
                                    <Text style={styles.periodText}>{plan.id.includes('annual') ? '/yr' : '/mo'}</Text>
                                </View>
                            </View>
                            {selectedPlan === plan.id && (
                                <Animated.View entering={FadeInDown} style={styles.selectionDot}>
                                    <Icon name="checkmark-circle" size={24} color="#10D9A5" />
                                </Animated.View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.subscribeButton}
                        onPress={handleSubscribe}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0F1E1C" />
                        ) : (
                            <Text style={styles.subscribeText}>Start My Premium Journey</Text>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.disclaimer}>
                        Recurring billing. Cancel anytime in App Store settings.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
                <Icon name={icon as any} size={20} color="#10D9A5" />
            </View>
            <View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1E1C',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A2E2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    crownContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
    },
    heroSubtitle: {
        color: '#A0AEC0',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
    },
    featuresContainer: {
        backgroundColor: '#1A2E2A',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    featureDesc: {
        color: '#A0AEC0',
        fontSize: 14,
        marginTop: 2,
    },
    plansContainer: {
        marginBottom: 32,
    },
    planCard: {
        backgroundColor: '#1A2E2A',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#2D3748',
        position: 'relative',
    },
    planCardActive: {
        borderColor: '#10D9A5',
        backgroundColor: 'rgba(16, 217, 165, 0.05)',
    },
    planCardPopular: {
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    popularText: {
        color: '#0F1E1C',
        fontSize: 10,
        fontWeight: '900',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    planDesc: {
        color: '#A0AEC0',
        fontSize: 12,
        marginTop: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
    },
    periodText: {
        color: '#A0AEC0',
        fontSize: 12,
    },
    selectionDot: {
        position: 'absolute',
        top: 20,
        left: -10,
    },
    footer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    subscribeButton: {
        backgroundColor: '#10D9A5',
        height: 65,
        borderRadius: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10D9A5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    subscribeText: {
        color: '#0F1E1C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disclaimer: {
        color: '#4A5568',
        fontSize: 12,
        marginTop: 15,
        textAlign: 'center',
    }
});
