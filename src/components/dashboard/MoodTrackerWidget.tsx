import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { Icon } from '../ui/Icon';
import { useWellness } from '../../hooks/useWellness';

const MOODS = [
    { id: 'great', label: 'Great', emoji: '😊', icon: 'happy', color: '#10D9A5' },
    { id: 'okay', label: 'Okay', emoji: '😐', icon: 'medical', color: '#F59E0B' }, // Using medical as a placeholder for neutral
    { id: 'bad', label: 'Bad', emoji: '😔', icon: 'sad', color: '#EF4444' },
];

const SIDE_EFFECTS = [
    'Nausea', 'Dizziness', 'Headache', 'Fatigue', 'Insomnia', 'Dry Mouth'
];

export const MoodTrackerWidget: React.FC = () => {
    const { saveLog, getLogForDate } = useWellness();
    const today = new Date().toISOString().split('T')[0];
    const existingLog = getLogForDate(today);

    const [selectedMood, setSelectedMood] = useState<string | null>(existingLog?.mood || null);
    const [showSideEffects, setShowSideEffects] = useState(false);
    const [selectedEffects, setSelectedEffects] = useState<string[]>(existingLog?.sideEffects || []);
    const [isLogged, setIsLogged] = useState(!!existingLog);

    const handleMoodSelect = (moodId: string) => {
        setSelectedMood(moodId);
        if (moodId === 'bad') {
            setShowSideEffects(true);
        } else {
            saveLog({ date: today, mood: moodId, sideEffects: [] });
            setIsLogged(true);
        }
    };

    const toggleEffect = (effect: string) => {
        setSelectedEffects(prev =>
            prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
        );
    };

    const handleSaveSideEffects = () => {
        saveLog({ date: today, mood: 'bad', sideEffects: selectedEffects });
        setShowSideEffects(false);
        setIsLogged(true);
    };

    if (isLogged) {
        return (
            <Animated.View
                entering={FadeInUp}
                style={styles.loggedContainer}
            >
                <Icon name="checkmark-circle" size={24} color="#10D9A5" />
                <Text style={styles.loggedText}>Wellness logged for today!</Text>
                <TouchableOpacity onPress={() => setIsLogged(false)}>
                    <Text style={styles.resetText}>Edit</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How are you feeling today?</Text>
            <View style={styles.moodRow}>
                {MOODS.map((mood) => (
                    <TouchableOpacity
                        key={mood.id}
                        onPress={() => handleMoodSelect(mood.id)}
                        style={[
                            styles.moodCard,
                            selectedMood === mood.id && { borderColor: mood.color, backgroundColor: `${mood.color}10` }
                        ]}
                    >
                        <Text style={styles.emoji}>{mood.emoji}</Text>
                        <Text style={styles.moodLabel}>{mood.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Side Effects Modal */}
            <Modal
                visible={showSideEffects}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Any side effects?</Text>
                            <TouchableOpacity onPress={() => setShowSideEffects(false)}>
                                <Icon name="close" size={24} color="#A0AEC0" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Select what you're experiencing:</Text>

                        <View style={styles.effectsGrid}>
                            {SIDE_EFFECTS.map((effect) => (
                                <TouchableOpacity
                                    key={effect}
                                    onPress={() => toggleEffect(effect)}
                                    style={[
                                        styles.effectChip,
                                        selectedEffects.includes(effect) && styles.effectChipActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.effectText,
                                        selectedEffects.includes(effect) && styles.effectTextActive
                                    ]}>
                                        {effect}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveSideEffects}
                        >
                            <Text style={styles.saveButtonText}>Save Wellness Log</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A2E2A',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    moodCard: {
        flex: 1,
        backgroundColor: '#0F1E1C',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    emoji: {
        fontSize: 32,
        marginBottom: 4,
    },
    moodLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#A0AEC0',
    },
    loggedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    loggedText: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    resetText: {
        color: '#10D9A5',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0F1E1C',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#A0AEC0',
        marginBottom: 24,
    },
    effectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    effectChip: {
        backgroundColor: '#1A2E2A',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    effectChipActive: {
        borderColor: '#10D9A5',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
    },
    effectText: {
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: '600',
    },
    effectTextActive: {
        color: '#10D9A5',
    },
    saveButton: {
        backgroundColor: '#10D9A5',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#0F1E1C',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
