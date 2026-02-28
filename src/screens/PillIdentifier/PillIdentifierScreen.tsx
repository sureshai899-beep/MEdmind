import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Icon } from '../../components';

const COLORS = [
    { id: 'white', label: 'White', color: '#FFFFFF' },
    { id: 'yellow', label: 'Yellow', color: '#F6E05E' },
    { id: 'blue', label: 'Blue', color: '#4299E1' },
    { id: 'red', label: 'Red', color: '#F56565' },
    { id: 'pink', label: 'Pink', color: '#ED64A6' },
    { id: 'green', label: 'Green', color: '#48BB78' },
];

const SHAPES = [
    { id: 'round', label: 'Round', icon: 'ellipse' },
    { id: 'oval', label: 'Oval', icon: 'ellipse-outline' },
    { id: 'capsule', label: 'Capsule', icon: 'capsule' }, // Custom icon might be needed, using ellipse-outline for now
    { id: 'rectangle', label: 'Rectangle', icon: 'square-outline' },
];

export default function PillIdentifierScreen() {
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [imprint, setImprint] = useState<string>('');

    const handleIdentify = () => {
        // Mock identification logic
        router.push('/medication/1' as any); // Redirect to a sample med for now
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#10D9A5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pill Identifier</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text style={styles.sectionTitle}>What does the pill look like?</Text>
                    <Text style={styles.subtitle}>Select features to identify your medication</Text>

                    {/* Color Selection */}
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.grid}>
                        {COLORS.map((color) => (
                            <TouchableOpacity
                                key={color.id}
                                onPress={() => setSelectedColor(color.id)}
                                style={[
                                    styles.colorCard,
                                    selectedColor === color.id && styles.activeCard
                                ]}
                            >
                                <View style={[styles.colorPreview, { backgroundColor: color.color }]} />
                                <Text style={styles.cardLabel}>{color.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Shape Selection */}
                    <Text style={styles.label}>Shape</Text>
                    <View style={styles.grid}>
                        {SHAPES.map((shape) => (
                            <TouchableOpacity
                                key={shape.id}
                                onPress={() => setSelectedShape(shape.id)}
                                style={[
                                    styles.shapeCard,
                                    selectedShape === shape.id && styles.activeCard
                                ]}
                            >
                                <Icon
                                    name={shape.icon as any}
                                    size={32}
                                    color={selectedShape === shape.id ? '#10D9A5' : '#718096'}
                                />
                                <Text style={styles.cardLabel}>{shape.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Imprint Placeholder */}
                    <Text style={styles.label}>Imprint (Optional)</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="edit" size={20} color="#718096" />
                        <Text style={styles.placeholderText}>e.g. "L484" or "M 20"</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.identifyButton,
                            (!selectedColor || !selectedShape) && styles.disabledButton
                        ]}
                        disabled={!selectedColor || !selectedShape}
                        onPress={handleIdentify}
                        testID="identify-button"
                    >
                        <Text style={styles.identifyButtonText}>Identify Medication</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.infoBox}>
                    <Icon name="info" size={20} color="#10D9A5" />
                    <Text style={styles.infoText}>
                        This tool is for informational purposes only. Always verify with your pharmacist or doctor before taking unidentified medication.
                    </Text>
                </View>
            </ScrollView>
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
        marginTop: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorCard: {
        width: '30%',
        backgroundColor: '#1A2E2A',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    shapeCard: {
        width: '47%',
        backgroundColor: '#1A2E2A',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeCard: {
        borderColor: '#10D9A5',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
    },
    colorPreview: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardLabel: {
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2E2A',
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    placeholderText: {
        color: '#4A5568',
        fontSize: 16,
    },
    identifyButton: {
        backgroundColor: '#10D9A5',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#2D3748',
    },
    identifyButtonText: {
        color: '#0F1E1C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#718096',
        lineHeight: 18,
    },
});
