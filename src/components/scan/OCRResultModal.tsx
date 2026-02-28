import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { InputField } from '../form/InputField';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { colors } from '../../constants/Colors';
import { TimingOptimizationWidget } from '../timing/TimingOptimizationWidget';

interface OCRResult {
    medicationName: string;
    dosage: string;
    frequency: string;
    form: string;
    strength: string;
    scheduleType: 'Daily' | 'SOS' | 'Cycles';
    duration: string;
    startDate: string;
}

interface OCRResultModalProps {
    visible: boolean;
    result: OCRResult | null;
    onClose: () => void;
    onSave: (finalResult: OCRResult) => void;
}

export function OCRResultModal({ visible, result, onClose, onSave }: OCRResultModalProps) {
    const [editedResult, setEditedResult] = useState<OCRResult>({
        medicationName: '',
        dosage: '',
        frequency: '',
        form: 'Pill',
        strength: '',
        scheduleType: 'Daily',
        duration: '7 days',
        startDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (result) {
            setEditedResult(prev => ({
                ...prev,
                ...result,
                // Ensure defaults for optional fields if not in result
                form: (result as any).form || 'Pill',
                strength: (result as any).strength || '',
                scheduleType: (result as any).scheduleType || 'Daily',
                duration: (result as any).duration || '7 days',
                startDate: (result as any).startDate || new Date().toISOString().split('T')[0],
            }));
        }
    }, [result]);

    const handleSave = () => {
        onSave(editedResult);
    };

    if (!result) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <View style={styles.iconCircle}>
                                <Icon name="medical" size={24} color={colors.primary.DEFAULT} />
                            </View>
                            <View>
                                <Text style={styles.title}>Scan Results</Text>
                                <Text style={styles.subtitle}>Review extracted medication data</Text>
                            </View>
                        </View>

                        <ScrollView style={styles.form}>
                            <InputField
                                label="Medication Name"
                                value={editedResult.medicationName}
                                onChangeText={(text) => setEditedResult(prev => ({ ...prev, medicationName: text }))}
                                placeholder="e.g. Lisinopril"
                            />

                            <InputField
                                label="Dosage"
                                value={editedResult.dosage}
                                onChangeText={(text) => setEditedResult(prev => ({ ...prev, dosage: text }))}
                                placeholder="e.g. 10mg"
                            />

                            <View style={styles.formRow}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <InputField
                                        label="Strength"
                                        value={editedResult.strength}
                                        onChangeText={(text) => setEditedResult(prev => ({ ...prev, strength: text }))}
                                        placeholder="e.g. 500mg"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        label="Form"
                                        value={editedResult.form}
                                        onChangeText={(text) => setEditedResult(prev => ({ ...prev, form: text }))}
                                        placeholder="e.g. Tablet"
                                    />
                                </View>
                            </View>

                            <InputField
                                label="Frequency"
                                value={editedResult.frequency}
                                onChangeText={(text) => setEditedResult(prev => ({ ...prev, frequency: text }))}
                                placeholder="e.g. Once daily"
                            />

                            <TimingOptimizationWidget
                                medicationName={editedResult.medicationName}
                                onAccept={(suggestions) => {
                                    setEditedResult(prev => ({
                                        ...prev,
                                        frequency: suggestions.map(s => `${s.label} (${s.time})`).join(', ')
                                    }));
                                }}
                            />

                            <View style={styles.disclaimer}>
                                <Icon name="info" size={16} color={`${colors.text.primary}66`} />
                                <Text style={styles.disclaimerText}>
                                    Always verify the information with your prescription bottle. Digital scans can sometimes be inaccurate.
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Add to Pillara</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: colors.background.secondary,
        borderRadius: 32,
        width: '100%',
        maxHeight: '80%',
        padding: 24,
        borderWidth: 1,
        borderColor: `${colors.primary.DEFAULT}33`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${colors.primary.DEFAULT}26`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        color: `${colors.text.primary}80`,
        fontSize: 14,
    },
    form: {
        marginBottom: 24,
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    disclaimer: {
        flexDirection: 'row',
        backgroundColor: `${colors.text.primary}0D`,
        padding: 12,
        borderRadius: 16,
        marginTop: 16,
    },
    disclaimerText: {
        color: `${colors.text.primary}66`,
        fontSize: 12,
        marginLeft: 8,
        flex: 1,
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: `${colors.text.primary}99`,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 2,
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: {
        color: colors.background.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
