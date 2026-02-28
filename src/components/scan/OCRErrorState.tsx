import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '../ui/Icon';
import Animated, { FadeIn } from 'react-native-reanimated';

interface OCRErrorStateProps {
    errorType: 'blurry' | 'language' | 'generic';
    onRetry: () => void;
    onManual: () => void;
}

export const OCRErrorState: React.FC<OCRErrorStateProps> = ({ errorType, onRetry, onManual }) => {
    const getContent = () => {
        switch (errorType) {
            case 'blurry':
                return {
                    title: 'Image Too Blurry',
                    description: 'We couldn\'t read the label clearly. Make sure you have good lighting and the bottle is still.',
                    icon: 'camera'
                };
            case 'language':
                return {
                    title: 'Unsupported Language',
                    description: 'The label seems to be in a language we don\'t support yet. Try adding it manually.',
                    icon: 'help'
                };
            default:
                return {
                    title: 'Scan Failed',
                    description: 'Something went wrong during extraction. Please try again or enter details manually.',
                    icon: 'warning'
                };
        }
    };

    const content = getContent();

    return (
        <Animated.View entering={FadeIn} style={styles.container}>
            <View style={styles.iconCircle}>
                <Icon name={content.icon as any} size={48} color="#FF5252" />
            </View>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.description}>{content.description}</Text>

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.manualButton} onPress={onManual}>
                    <Text style={styles.manualText}>Enter Manually</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#1A2E2A',
        borderRadius: 32,
        margin: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 82, 82, 0.2)',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#A0AEC0',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    buttonGroup: {
        width: '100%',
        gap: 12,
    },
    retryButton: {
        backgroundColor: '#10D9A5',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    retryText: {
        color: '#0F1E1C',
        fontSize: 16,
        fontWeight: 'bold',
    },
    manualButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    manualText: {
        color: '#A0AEC0',
        fontSize: 16,
        fontWeight: '600',
    },
});
