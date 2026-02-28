import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { recognizeText, isValidMedicationResult } from '../services/ocrService';

export interface CameraPermissions {
    camera: boolean;
    mediaLibrary: boolean;
}

export function useCamera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [micPermission, requestMicPermission] = useMicrophonePermissions();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Request camera permissions
     */
    const requestCamera = useCallback(async () => {
        try {
            const response = await requestPermission();
            return response.granted;
        } catch (err) {
            setError('Failed to request camera permission');
            return false;
        }
    }, [requestPermission]);

    /**
     * Request media library permissions
     */
    const requestMediaLibraryPermission = useCallback(async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const granted = status === 'granted';
            return granted;
        } catch (err) {
            setError('Failed to request media library permission');
            return false;
        }
    }, []);

    /**
     * Pick image from library
     */
    const pickImage = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const granted = await requestMediaLibraryPermission();
            if (!granted) {
                throw new Error('Media library permission not granted');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                return result.assets[0];
            }

            return null;
        } catch (err) {
            setError('Failed to pick image');
            console.error('Image picker error:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [requestMediaLibraryPermission]);

    /**
     * Process image for OCR using Google ML Kit
     */
    const processImageForOCR = useCallback(async (imageUri: string) => {
        try {
            setLoading(true);
            setError(null);

            const result = await recognizeText(imageUri);

            if (!result || !isValidMedicationResult(result)) {
                setError('Could not extract medication information from image');
                return null;
            }

            return {
                text: result.text,
                confidence: result.confidence,
                medicationName: result.medicationName || 'Unknown Medication',
                dosage: result.dosage || 'Not specified',
                frequency: result.frequency || 'As directed',
            };
        } catch (err) {
            setError('Failed to process image. Please ensure the text is clear and try again.');
            console.error('OCR error:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get image file info
     */
    const getImageInfo = useCallback(async (uri: string) => {
        try {
            const info = await FileSystem.getInfoAsync(uri);
            return info;
        } catch (err) {
            console.error('Failed to get image info:', err);
            return null;
        }
    }, []);

    return {
        permission,
        loading,
        error,
        requestPermission: requestCamera,
        requestMediaLibraryPermission,
        pickImage,
        processImageForOCR,
        getImageInfo,
    };
}
