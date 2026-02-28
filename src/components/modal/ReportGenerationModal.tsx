import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { colors } from '../../constants/Colors';

interface ReportGenerationModalProps {
    visible: boolean;
    onClose: () => void;
    onGenerate: (options: { startDate: Date; endDate: Date; format: 'pdf' | 'csv' }) => void;
}

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
    visible,
    onClose,
    onGenerate
}) => {
    const [range, setRange] = useState<'7' | '30' | '90' | 'custom'>('30');
    const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

    const handleGenerate = () => {
        let startDate = new Date();
        if (range === '7') startDate.setDate(startDate.getDate() - 7);
        else if (range === '30') startDate.setDate(startDate.getDate() - 30);
        else if (range === '90') startDate.setDate(startDate.getDate() - 90);
        else startDate.setDate(startDate.getDate() - 365); // Simplified custom

        onGenerate({
            startDate,
            endDate: new Date(),
            format
        });
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Export Report</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color={colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Select Date Range</Text>
                    <View style={styles.rangeGrid}>
                        {['7', '30', '90', 'custom'].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.rangeButton, range === r && styles.activeRange]}
                                onPress={() => setRange(r as any)}
                            >
                                <Text style={[styles.rangeText, range === r && styles.activeRangeText]}>
                                    {r === 'custom' ? 'All' : `${r} Days`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Export Format</Text>
                    <View style={styles.formatRow}>
                        <TouchableOpacity
                            style={[styles.formatCard, format === 'pdf' && styles.activeFormat]}
                            onPress={() => setFormat('pdf')}
                        >
                            <Icon name="document-text" size={32} color={format === 'pdf' ? colors.primary.DEFAULT : colors.text.secondary} />
                            <Text style={[styles.formatText, format === 'pdf' && styles.activeFormatText]}>PDF Report</Text>
                            <Text style={styles.formatSub}>For Doctors</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.formatCard, format === 'csv' && styles.activeFormat]}
                            onPress={() => setFormat('csv')}
                        >
                            <Icon name="list" size={32} color={format === 'csv' ? colors.primary.DEFAULT : colors.text.secondary} />
                            <Text style={[styles.formatText, format === 'csv' && styles.activeFormatText]}>CSV Data</Text>
                            <Text style={styles.formatSub}>For Analysis</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>
                        <Icon name="info" size={16} color={`${colors.primary.DEFAULT}99`} />
                        <Text style={styles.infoText}>
                            Your report will include adherence stats, medication breakdown, and detailed dose history.
                        </Text>
                    </View>

                    <Button
                        onPress={handleGenerate}
                        variant="primary"
                        size="lg"
                        className="mt-4"
                    >
                        Generate & Share
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.secondary,
        textTransform: 'uppercase',
        marginBottom: 12,
        letterSpacing: 1,
    },
    rangeGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 32,
    },
    rangeButton: {
        flex: 1,
        backgroundColor: colors.background.secondary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    activeRange: {
        borderColor: colors.primary.DEFAULT,
        backgroundColor: `${colors.primary.DEFAULT}1A`,
    },
    rangeText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeRangeText: {
        color: colors.primary.DEFAULT,
    },
    formatRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 32,
    },
    formatCard: {
        flex: 1,
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    activeFormat: {
        borderColor: colors.primary.DEFAULT,
        backgroundColor: `${colors.primary.DEFAULT}1A`,
    },
    formatText: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 12,
    },
    activeFormatText: {
        color: colors.primary.DEFAULT,
    },
    formatSub: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 4,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: `${colors.primary.DEFAULT}0D`,
        padding: 16,
        borderRadius: 16,
        gap: 12,
        marginBottom: 24,
    },
    infoText: {
        flex: 1,
        color: `${colors.text.primary}99`,
        fontSize: 12,
        lineHeight: 18,
    },
});
