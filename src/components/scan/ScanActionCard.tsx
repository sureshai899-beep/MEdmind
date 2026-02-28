import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export interface ScanActionCardProps {
    onTakePhoto: () => void;
    onChooseLibrary: () => void;
    className?: string;
}

export const ScanActionCard: React.FC<ScanActionCardProps> = ({
    onTakePhoto,
    onChooseLibrary,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.visualContainer}>
                <View style={styles.placeholderIcon}>
                    <Text style={styles.emoji}>📄</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={onTakePhoto}
                style={styles.primaryButton}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonEmoji}>📷</Text>
                <Text style={styles.primaryButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onChooseLibrary}
                style={styles.secondaryButton}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonEmoji}>🖼️</Text>
                <Text style={styles.secondaryButtonText}>Choose from Library</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    visualContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#1A2E2A',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    placeholderIcon: {
        width: 80,
        height: 100,
        backgroundColor: 'rgba(45, 55, 72, 0.3)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#4A5568',
    },
    emoji: {
        fontSize: 40,
    },
    buttonEmoji: {
        fontSize: 28,
        marginRight: 12,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(16, 217, 165, 0.3)',
        paddingVertical: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#10D9A5',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: 'rgba(45, 55, 72, 0.3)',
        paddingVertical: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
