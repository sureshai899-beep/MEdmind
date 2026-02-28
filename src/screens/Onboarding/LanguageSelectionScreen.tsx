import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Icon } from '../../components';

const LANGUAGES = [
    { id: 'en', label: 'English', native: 'English', region: 'Global' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी', region: 'North India' },
    { id: 'mr', label: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
    { id: 'bn', label: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
    { id: 'te', label: 'Telugu', native: 'తెలుగు', region: 'Andhra/Telangana' },
    { id: 'ta', label: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu' },
    { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
    { id: 'ml', label: 'Malayalam', native: 'മലയാളം', region: 'Kerala' },
    { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
    { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab' },
    { id: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha' },
];

export default function LanguageSelectionScreen() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleSelect = (id: string) => {
        setSelectedLanguage(id);
    };

    const handleContinue = () => {
        // In a real app, update i18n and persist choice
        router.back();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    testID="back-button"
                >
                    <Icon name="arrow-back" size={24} color="#10D9A5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Language</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text style={styles.title}>Choose your language</Text>
                    <Text style={styles.subtitle}>App interface and OCR will be optimized for your selection</Text>
                </Animated.View>

                <FlatList
                    data={LANGUAGES}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInUp.delay(100 + index * 50)}>
                            <TouchableOpacity
                                onPress={() => handleSelect(item.id)}
                                style={[
                                    styles.languageCard,
                                    selectedLanguage === item.id && styles.activeCard
                                ]}
                            >
                                <View style={styles.languageInfo}>
                                    <View style={styles.textContainer}>
                                        <Text style={[
                                            styles.languageLabel,
                                            selectedLanguage === item.id && styles.activeText
                                        ]}>
                                            {item.label}
                                        </Text>
                                        <Text style={styles.nativeLabel}>{item.native}</Text>
                                    </View>
                                    <Text style={styles.regionLabel}>{item.region}</Text>
                                </View>
                                {selectedLanguage === item.id && (
                                    <Icon name="checkmark-circle" size={24} color="#10D9A5" />
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                />

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>Confirm & Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
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
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 8,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#A0AEC0',
        marginBottom: 24,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2E2A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeCard: {
        borderColor: '#10D9A5',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
    },
    languageInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    activeText: {
        color: '#10D9A5',
    },
    nativeLabel: {
        fontSize: 14,
        color: '#718096',
    },
    regionLabel: {
        fontSize: 12,
        color: '#4A5568',
        backgroundColor: '#0F1E1C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    continueButton: {
        backgroundColor: '#10D9A5',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    continueButtonText: {
        color: '#0F1E1C',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
