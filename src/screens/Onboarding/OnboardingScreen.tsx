import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    StatusBar
} from 'react-native';
import { OnboardingStepper, ProfileSetupForm } from '../../components';
import { OnboardingSlide, ONBOARDING_SLIDES } from '../../components/onboarding';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { notificationService } from '../../services/notificationService';
import { useCameraPermissions } from 'expo-camera';
import { usePrivacy } from '../../hooks/usePrivacy';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/Colors';

export function OnboardingScreen() {
    const router = useRouter();
    const { setHasOnboarded, updateUser, isAuthenticated } = useAuth();
    const { updateConsent, updatePersonalInfo } = useProfile();
    const { toggleBiometric, isBiometricSupported } = usePrivacy();
    const [currentStep, setCurrentStep] = useState(0);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [consentGiven, setConsentGiven] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const slides = ONBOARDING_SLIDES;
    const currentSlide = slides[currentStep];

    const nextStep = () => {
        if (currentStep < slides.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleNext = async () => {
        if (isRequesting) return;

        if (currentSlide.isConsent && !consentGiven) {
            Alert.alert("Consent Required", "Please acknowledge the data storage policy to proceed.");
            return;
        }

        try {
            setIsRequesting(true);

            if (currentSlide.isConsent) {
                await updateConsent({ dataStorage: true });
            }

            if (currentSlide.isValueProp) {
                setIsRequesting(false);
                nextStep();
                return;
            }

            if (currentSlide.isMultiPerm) {
                await requestCameraPermission();
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                await notificationService.requestPermissions();

                setIsRequesting(false);
                nextStep();
                return;
            }

            if (currentSlide.isPrivacy) {
                if (isBiometricSupported) {
                    const success = await toggleBiometric(true);
                    if (!success) {
                        Alert.alert(
                            "Security",
                            "Biometric setup skipped. You can enable it anytime in settings.",
                            [{ text: "Continue", onPress: () => { setIsRequesting(false); nextStep(); } }]
                        );
                        return;
                    }
                }
            }

            setIsRequesting(false);
            nextStep();
        } catch (error) {
            console.error('Onboarding error:', error);
            setIsRequesting(false);
            nextStep();
        }
    };

    const handleProfileComplete = async (data: { name: string; age?: number; profilePictureUrl?: string }) => {
        try {
            setIsRequesting(true);
            await updatePersonalInfo({
                name: data.name,
                age: data.age,
                profilePictureUrl: data.profilePictureUrl
            });

            if (isAuthenticated) {
                await updateUser({ name: data.name, profilePictureUrl: data.profilePictureUrl });
            }

            await setHasOnboarded(true);
            router.replace('/(tabs)');
        } catch (err) {
            console.error('Failed to finish onboarding:', err);
            Alert.alert('Error', 'Failed to save your profile. Please try again.');
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <OnboardingStepper
                    totalSteps={slides.length}
                    currentStep={currentStep}
                />
            </View>

            <View style={styles.content}>
                {!currentSlide.isProfile ? (
                    <OnboardingSlide
                        slide={currentSlide}
                        onNext={handleNext}
                        isRequesting={isRequesting}
                        consentGiven={consentGiven}
                        onToggleConsent={() => setConsentGiven(!consentGiven)}
                    />
                ) : (
                    <ProfileSetupForm onComplete={handleProfileComplete} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    }
});
