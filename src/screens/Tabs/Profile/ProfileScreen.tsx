import React, { useState } from 'react';
import { ScrollView, View, Text, Modal, Alert } from 'react-native';
import { ProfileHeader, ListItem, CaregiverInvitationModal, Icon } from '../../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProfile } from '../../../hooks/useProfile';
import { useAuth } from '../../../hooks/useAuth';
import { colors } from '../../../constants/Colors';

export function ProfileScreen() {
    const router = useRouter();
    const [showCaregiverModal, setShowCaregiverModal] = useState(false);

    // Use custom hooks
    const { profile } = useProfile();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <Animated.View entering={FadeInDown.duration(600)} className="mt-2">
                <ProfileHeader
                    name={user?.name || profile.personalInfo.name || "User"}
                    email={user?.email || profile.personalInfo.email || "user@example.com"}
                    profilePictureUrl={user?.profilePictureUrl || profile.personalInfo.profilePictureUrl || "https://via.placeholder.com/100"}
                />
            </Animated.View>

            <ScrollView className="flex-1 px-md mt-lg">
                <Animated.Text
                    entering={FadeInDown.delay(200).duration(600)}
                    className="text-text-tertiary text-caption font-bold uppercase mb-md px-xs tracking-widest"
                >
                    Account Settings
                </Animated.Text>

                <Animated.View entering={FadeInUp.delay(300).duration(600)}>
                    <ListItem
                        title="Personal Information"
                        icon={<Icon name="person" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/profile/personal-info')}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(400).duration(600)}>
                    <ListItem
                        title="Health Profile"
                        icon={<Icon name="medical" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/profile/health')}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(450).duration(600)}>
                    <ListItem
                        title="Medical Directory"
                        subtitle="Doctors & Pharmacies"
                        icon={<Icon name="people" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/contacts' as any)}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                    <ListItem
                        title="Language"
                        subtitle="English"
                        icon={<Icon name="help" color={colors.primary.DEFAULT} />} // Reusing help for now, might change later
                        onPress={() => router.push('/language' as any)}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(550).duration(600)}>
                    <ListItem
                        title="Add Caregiver"
                        icon={<Icon name="people" color={colors.primary.DEFAULT} />}
                        onPress={() => setShowCaregiverModal(true)}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(600).duration(600)}>
                    <ListItem
                        title="Wearable Sync"
                        subtitle="Apple Watch & Galaxy"
                        icon={<Icon name="watch" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/profile/wearable-sync' as any)}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(650).duration(600)}>
                    <ListItem
                        title="Privacy & Security"
                        icon={<Icon name="lock" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/profile/privacy')}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(650).duration(600)}>
                    <ListItem
                        title="Pillara Premium"
                        subtitle={profile.isPremium ? "Active Plan" : "Try 7 days free"}
                        icon={<Icon name="star" color={profile.isPremium ? "#FFD700" : colors.primary.DEFAULT} />}
                        onPress={() => router.push('/premium')}
                    />
                </Animated.View>

                <Animated.Text
                    entering={FadeInDown.delay(700).duration(600)}
                    className="text-text-tertiary text-caption font-bold uppercase mt-xl mb-md px-xs tracking-widest"
                >
                    Support & Dev
                </Animated.Text>

                <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                    <ListItem
                        title="Help Center"
                        icon={<Icon name="help" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/profile/help')}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(850).duration(600)}>
                    <ListItem
                        title="Design System Guide"
                        icon={<Icon name="color-palette" color={colors.primary.DEFAULT} />}
                        onPress={() => router.push('/style-guide')}
                    />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(900).duration(600)}>
                    <ListItem
                        title="Logout"
                        icon={<Icon name="logout" color={colors.status.missed} />}
                        onPress={handleLogout}
                        className="opacity-80"
                    />
                </Animated.View>

                <View className="h-20" />
            </ScrollView>

            <Modal
                visible={showCaregiverModal}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 justify-end bg-black/50">
                    <CaregiverInvitationModal
                        caregiverName="Dr. Smith"
                        onAccept={() => setShowCaregiverModal(false)}
                        onDecline={() => setShowCaregiverModal(false)}
                        onClose={() => setShowCaregiverModal(false)}
                        permissions={[
                            { label: "View Medications", enabled: true, icon: <Icon name="pill" color={colors.primary.DEFAULT} />, onToggle: () => { } },
                            { label: "View Health Logs", enabled: true, icon: <Icon name="stats" color={colors.primary.DEFAULT} />, onToggle: () => { } },
                        ]}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}
