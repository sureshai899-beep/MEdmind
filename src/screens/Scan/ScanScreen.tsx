import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScanProgress, ScanInstructionBox, ScanActionCard, Button, Icon, OCRResultModal } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCamera } from '../../hooks/useCamera';
import { useMedications } from '../../hooks/useMedications';
import { CustomCameraView } from '../../components/camera/CustomCameraView';

export function ScanScreen() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [showCamera, setShowCamera] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [ocrData, setOcrData] = useState<any>(null);

    const { pickImage, processImageForOCR, loading, error } = useCamera();
    const { addMedication } = useMedications();

    const handleScanComplete = () => {
        router.push('/scan-success');
    };

    const handleSaveResult = async (finalData: any) => {
        try {
            setShowPreview(false);
            setIsScanning(true);
            setScanProgress(90);

            await addMedication({
                name: finalData.medicationName,
                dosage: finalData.dosage,
                frequency: finalData.frequency,
                schedule: finalData.frequency,
                status: 'Active',
            });

            setScanProgress(100);
            setTimeout(handleScanComplete, 500);
        } catch (err) {
            console.error('Save error:', err);
            setIsScanning(false);
            Alert.alert('Error', 'Failed to save medication. Please try again.');
        }
    };

    const handleCapture = async ({ uri, type }: { uri: string; type: 'image' | 'video' }) => {
        console.log('Captured media:', uri, type);
        setShowCamera(false);

        if (type === 'video') {
            Alert.alert("Video Recorded", "Video has been saved successfully.");
            return;
        }

        try {
            setIsScanning(true);
            setScanProgress(30);

            // Process image with OCR
            const ocrResult = await processImageForOCR(uri);
            setScanProgress(100);

            if (ocrResult) {
                setOcrData(ocrResult);
                setIsScanning(false);
                setShowPreview(true);
            } else {
                setIsScanning(false);
                Alert.alert('Scan Failed', 'Could not extract medication information. Please try manual entry.');
            }
        } catch (err) {
            console.error('Processing error:', err);
            setIsScanning(false);
            Alert.alert('Error', 'Failed to process scan. Please try again or use manual entry.');
        }
    };

    const handlePickImage = async () => {
        try {
            const result = await pickImage();

            if (result) {
                handleCapture({ uri: result.uri, type: 'image' });
            }
        } catch (err) {
            setIsScanning(false);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    if (isScanning) {
        return (
            <ScanProgress
                progress={scanProgress}
                statusText={
                    scanProgress < 40
                        ? "Analyzing prescription label..."
                        : scanProgress < 80
                            ? "Extracting medication details..."
                            : "Finalizing..."
                }
                onCancel={() => setIsScanning(false)}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#10D9A5" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Medication</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.instructionWrapper}>
                    <ScanInstructionBox
                        instruction="Scan your medication bottle or prescription paper to automatically extract details."
                    />
                </View>

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <ScanActionCard
                    onTakePhoto={() => {
                        console.log('Opening camera...');
                        setShowCamera(true);
                    }}
                    onChooseLibrary={handlePickImage}
                />

                {loading && !isScanning && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#10D9A5" />
                        <Text style={styles.loadingText}>Processing...</Text>
                    </View>
                )}

                <View style={styles.manualWrapper}>
                    <Text style={styles.manualText}>Or enter details manually</Text>
                    <TouchableOpacity
                        style={styles.manualButton}
                        onPress={() => router.push({ pathname: '/medication/form', params: { mode: 'add' } })}
                    >
                        <Text style={styles.manualButtonText}>Manual Entry</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CustomCameraView
                visible={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handleCapture}
            />

            <OCRResultModal
                visible={showPreview}
                result={ocrData}
                onClose={() => setShowPreview(false)}
                onSave={handleSaveResult}
            />
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
        padding: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backText: {
        color: '#10D9A5',
        fontSize: 18,
        marginLeft: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    instructionWrapper: {
        marginBottom: 32,
    },
    errorBox: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(231, 76, 60, 0.3)',
    },
    errorText: {
        color: '#E74C3C',
        textAlign: 'center',
        fontSize: 14,
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: '#A0AEC0',
        marginTop: 8,
        fontSize: 16,
    },
    manualWrapper: {
        marginTop: 'auto',
        marginBottom: 20,
        alignItems: 'center',
    },
    manualText: {
        color: '#A0AEC0',
        fontSize: 16,
        marginBottom: 16,
    },
    manualButton: {
        backgroundColor: '#1A2E2A',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    manualButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
