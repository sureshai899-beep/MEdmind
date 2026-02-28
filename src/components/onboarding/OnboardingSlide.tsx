import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Button } from '../../components';
import { OnboardingSlideData } from './OnboardingData';
import { colors } from '../../constants/Colors';

interface OnboardingSlideProps {
    slide: OnboardingSlideData;
    onNext: () => void;
    isRequesting: boolean;
    consentGiven: boolean;
    onToggleConsent: () => void;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
    slide,
    onNext,
    isRequesting,
    consentGiven,
    onToggleConsent
}) => {
    return (
        <View style={styles.slideContent}>
            <View style={styles.iconContainer}>
                <Icon name={slide.icon} size={80} color={slide.color} />
            </View>

            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            {slide.isConsent && (
                <TouchableOpacity
                    style={[styles.consentBox, consentGiven && styles.consentBoxActive]}
                    onPress={onToggleConsent}
                    activeOpacity={0.8}
                >
                    <View style={[styles.checkbox, consentGiven && styles.checkboxActive]}>
                        {consentGiven && <Icon name="checkmark" size={16} color={colors.background.primary} />}
                    </View>
                    <Text style={styles.consentText}>
                        I understand and consent to local data storage for my medical information.
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.footer}>
                <Button
                    onPress={onNext}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isRequesting}
                >
                    {slide.isMultiPerm ? "Grant Permission" :
                        slide.isPrivacy ? "Enable Security" :
                            slide.id === 'consent' ? "I Consent" : "Next"}
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slideContent: {
        width: '100%',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 30,
        borderRadius: 50,
        backgroundColor: colors.background.secondary,
        marginBottom: 40,
    },
    title: {
        color: colors.text.primary,
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        color: colors.text.tertiary,
        fontSize: 18,
        lineHeight: 28,
        textAlign: 'center',
        marginBottom: 40,
    },
    consentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: 20,
        borderRadius: 20,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: colors.ui.border,
        width: '100%',
    },
    consentBoxActive: {
        borderColor: colors.primary.DEFAULT,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.ui.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    consentText: {
        color: colors.text.primary,
        fontSize: 16,
        marginLeft: 15,
        flex: 1,
        fontWeight: '500',
    },
    footer: {
        width: '100%',
    }
});
