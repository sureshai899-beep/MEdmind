import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DashboardHeader, TimeNavigator, QuickInfoCard, AdherenceRing, MedicationCard, FloatingActionButton, InsightBanner, SkeletonMedicationCard, Icon } from '../../../components';
import { MoodTrackerWidget } from '../../../components/dashboard/MoodTrackerWidget';
import { ProfileSwitcherSheet, Profile } from '../../../components/profile/ProfileSwitcherSheet';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import Animated, {
    FadeInUp,
    FadeInDown
} from 'react-native-reanimated';
import { useMedications } from '../../../hooks/useMedications';
import { useDoses } from '../../../hooks/useDoses';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';

export function DashboardScreen() {
    const router = useRouter();
    const [activePeriod, setActivePeriod] = React.useState<any>("Today");
    const [showProfileSwitcher, setShowProfileSwitcher] = React.useState(false);

    // Use custom hooks
    const { medications, loading: medsLoading, decrementPillCount } = useMedications();
    const { calculateAdherence, getTodayDoses, logDose } = useDoses();
    const { user } = useAuth();
    const { profile } = useProfile();

    const [currentProfile, setCurrentProfile] = React.useState<Profile>({
        id: '1',
        name: "User",
        role: 'self',
        profilePictureUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    });

    useEffect(() => {
        if (user) {
            setCurrentProfile(prev => ({
                ...prev,
                name: user.name || prev.name,
                profilePictureUrl: user.profilePictureUrl || prev.profilePictureUrl
            }));
        }
    }, [user]);

    const mockProfiles: Profile[] = [
        { id: '1', name: user?.name || "User", role: 'self', profilePictureUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: '2', name: 'Dad', role: 'dependent', profilePictureUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: '3', name: 'Mom', role: 'dependent', profilePictureUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
    ];

    // Calculate adherence percentage
    const adherence = calculateAdherence(7); // 7-day adherence

    // Get today's doses
    const todayDoses = getTodayDoses();
    const pendingDoses = todayDoses.filter(dose => dose.status === 'pending');

    // Get active medications
    const activeMedications = medications.filter(med => med.status === 'Active');

    // Handle dose actions
    const handleTakeDose = async (medicationId: string, medicationName: string) => {
        try {
            await logDose(
                medicationId,
                medicationName,
                'taken',
                new Date().toISOString()
            );

            // Decrement pill count for the medication
            await decrementPillCount(medicationId);

            console.log('Dose logged as taken and pill count decremented');
        } catch (error) {
            console.error('Error logging dose:', error);
        }
    };

    const handleSnoozeDose = async (medicationId: string, medicationName: string) => {
        try {
            await logDose(
                medicationId,
                medicationName,
                'snoozed',
                new Date().toISOString(),
                'Snoozed for 30 minutes'
            );
            console.log('Dose snoozed');
        } catch (error) {
            console.error('Error snoozing dose:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <Animated.View entering={FadeInDown.duration(600)} className="mt-2">
                <DashboardHeader
                    userName={currentProfile.name}
                    profilePictureUrl={currentProfile.profilePictureUrl}
                    onAvatarPress={() => setShowProfileSwitcher(true)}
                />
            </Animated.View>

            <ScrollView className="flex-1 px-md" showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                    <TimeNavigator
                        activePeriod={activePeriod}
                        onPeriodChange={setActivePeriod}
                        className="mt-md mb-lg"
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(300).duration(600)}
                    className="flex-row gap-md mb-lg"
                >
                    <AdherenceRing
                        percentage={adherence}
                        size={140}
                        strokeWidth={14}
                    />
                    <QuickInfoCard
                        title={`${pendingDoses.length} Left`}
                        subtitle="Doses Today"
                        variant="dark"
                        className="flex-1"
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(600)}>
                    <InsightBanner
                        title="Health Tip"
                        message="Taking your medication at the same time every day helps maintain consistent levels in your body."
                        className="mb-lg"
                        onClose={() => console.log('Banner closed')}
                    />
                </Animated.View>

                {!profile.isPremium && (
                    <Animated.View entering={FadeInUp.delay(450).duration(600)}>
                        <TouchableOpacity
                            onPress={() => router.push('/premium')}
                            style={styles.premiumBanner}
                        >
                            <View style={styles.premiumIcon}>
                                <Icon name="star" size={24} color="#FFD700" />
                            </View>
                            <View className="flex-1 ml-md">
                                <Text className="text-white font-bold text-base">Unlock Pillara Premium</Text>
                                <Text className="text-white/60 text-xs">Unlimited scans, Interaction alerts & more</Text>
                            </View>
                            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                <Animated.View
                    entering={FadeInUp.delay(475).duration(600)}
                    className="flex-row gap-md mb-lg"
                >
                    <TouchableOpacity
                        onPress={() => router.push('/analytics' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(49, 130, 206, 0.1)' }]}>
                            <Icon name="stats" size={20} color="#3182CE" />
                        </View>
                        <Text style={styles.insightTitle}>Compliance Analytics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/interactions' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                            <Icon name="warning" size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.insightTitle}>Safety Alerts</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View
                    entering={FadeInUp.delay(500).duration(600)}
                    className="flex-row gap-md mb-lg"
                >
                    <TouchableOpacity
                        onPress={() => router.push('/pill-identifier' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                            <Icon name="search" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.insightTitle}>Pill Identifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/mood-tracker' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(16, 217, 165, 0.1)' }]}>
                            <Icon name="happy" size={20} color="#10D9A5" />
                        </View>
                        <Text style={styles.insightTitle}>Mood & Side Effects</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(525).duration(600)}
                    className="flex-row gap-md mb-lg"
                >
                    <TouchableOpacity
                        onPress={() => router.push('/contacts' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                            <Icon name="people" size={20} color="#8B5CF6" />
                        </View>
                        <Text style={styles.insightTitle}>Medical Directory</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/achievements' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                            <Icon name="star" size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.insightTitle}>Medmind Goals</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(550).duration(600)}
                    className="flex-row gap-md mb-lg"
                >
                    <TouchableOpacity
                        onPress={() => router.push('/pharmacy-map' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(16, 217, 165, 0.1)' }]}>
                            <Icon name="cart" size={20} color="#10D9A5" />
                        </View>
                        <Text style={styles.insightTitle}>Nearby Pharmacies</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/generic-comparison' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                            <Icon name="refresh" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.insightTitle}>Generic Savings</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(575).duration(600)}
                    className="flex-row gap-md mb-lg"
                >
                    <TouchableOpacity
                        onPress={() => router.push('/telehealth' as any)}
                        style={styles.insightCard}
                    >
                        <View style={[styles.insightIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                            <Icon name="medical" size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.insightTitle}>Telehealth Care</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />
                </Animated.View>

                <MoodTrackerWidget />

                <Animated.Text
                    entering={FadeInUp.delay(500).duration(600)}
                    className="text-text-primary text-h2 mb-md"
                >
                    Upcoming Meds
                </Animated.Text>

                {medsLoading ? (
                    <View className="space-y-md">
                        <Animated.View entering={FadeInUp.delay(600).duration(600)}>
                            <SkeletonMedicationCard />
                        </Animated.View>
                        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
                            <SkeletonMedicationCard />
                        </Animated.View>
                        <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                            <SkeletonMedicationCard />
                        </Animated.View>
                    </View>
                ) : activeMedications.length === 0 ? (
                    <Animated.View
                        entering={FadeInUp.delay(600).duration(600)}
                        className="bg-background-secondary p-xl rounded-3xl border border-dashed border-ui-border items-center"
                    >
                        <Text className="text-4xl mb-md">✨</Text>
                        <Text className="text-text-primary text-body-lg font-bold mb-xs">No medications yet!</Text>
                        <Text className="text-text-secondary text-body text-center">
                            Add your first medication to start tracking.
                        </Text>
                    </Animated.View>
                ) : (
                    <View className="space-y-md">
                        {activeMedications.map((medication, index) => (
                            <Animated.View
                                key={medication.id}
                                entering={FadeInUp.delay(600 + index * 100).duration(600)}
                                className="mb-md"
                            >
                                <Link href={`/medication/${medication.id}`} asChild>
                                    <TouchableOpacity activeOpacity={0.7}>
                                        <MedicationCard
                                            name={medication.name}
                                            dosage={`${medication.dosage} • ${medication.frequency}`}
                                            status={index === 0 ? "next" : "pending"}
                                            time={medication.nextDoseTime || "Not scheduled"}
                                            onTake={() => handleTakeDose(medication.id, medication.name)}
                                            onSnooze={() => handleSnoozeDose(medication.id, medication.name)}
                                        />
                                    </TouchableOpacity>
                                </Link>
                            </Animated.View>
                        ))}
                    </View>
                )}

                <View className="h-24" />
            </ScrollView>

            <Animated.View entering={FadeInDown.delay(1000).springify()}>
                <FloatingActionButton
                    icon="+"
                    label="Scan Med"
                    onPress={() => router.push('/scan')}
                />
            </Animated.View>
            <Modal
                visible={showProfileSwitcher}
                transparent={true}
                animationType="slide"
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <ProfileSwitcherSheet
                        profiles={mockProfiles}
                        currentProfileId={currentProfile.id}
                        onSelect={(p) => {
                            setCurrentProfile(p);
                            setShowProfileSwitcher(false);
                        }}
                        onClose={() => setShowProfileSwitcher(false)}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    premiumBanner: {
        backgroundColor: '#1A2E2A',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    premiumIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightCard: {
        flex: 1,
        backgroundColor: '#1A2E2A',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    insightIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    insightTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 18,
    }
});
