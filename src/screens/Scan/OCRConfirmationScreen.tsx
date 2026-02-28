import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormInput } from '../../components/form/FormInput';
import { Button } from '../../components/ui/Button';
import { useMedications } from '../../hooks/useMedications';
import { OCRResultSchema } from '../../utils/schemas';

export function OCRConfirmationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse the data passed from the scan screen
    const rawData = typeof params.data === 'string' ? JSON.parse(params.data) : params.data;

    // Validate with Zod
    const validation = OCRResultSchema.safeParse(rawData);
    const initialData = validation.success ? validation.data : { medicationName: '', dosage: '', frequency: '', text: '' };

    const [name, setName] = useState(initialData.medicationName || "");
    const [dosage, setDosage] = useState(initialData.dosage || "");
    const [frequency, setFrequency] = useState(initialData.frequency || "");
    const [loading, setLoading] = useState(false);

    const { addMedication } = useMedications();

    const handleConfirm = async () => {
        if (!name || !dosage) {
            Alert.alert("Missing Information", "Please ensure the medication name and dosage are correct.");
            return;
        }

        try {
            setLoading(true);
            await addMedication({
                name,
                dosage,
                frequency: frequency || "Once daily",
                status: 'Active',
                schedule: frequency || "Once daily",
            });

            router.push('/scan-success');
        } catch (error) {
            Alert.alert("Error", "Failed to save medication. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-lg py-md border-b border-background-secondary">
                <Text className="text-text-primary text-h3">Verify Medication</Text>
                <Text className="text-text-secondary text-body mt-xs">
                    We've scanned the label. Please confirm the details below.
                </Text>
            </View>

            <ScrollView className="flex-1 px-lg pt-lg">
                <FormInput
                    label="Medication Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Lisinopril"
                />

                <FormInput
                    label="Dosage"
                    value={dosage}
                    onChangeText={setDosage}
                    placeholder="e.g. 10mg"
                />

                <FormInput
                    label="Frequency"
                    value={frequency}
                    onChangeText={setFrequency}
                    placeholder="e.g. Once daily"
                />

                <View className="mt-lg p-lg bg-background-secondary rounded-xl">
                    <Text className="text-text-tertiary text-xs uppercase font-bold mb-xs">Scanned Text</Text>
                    <Text className="text-text-secondary text-sm italic" numberOfLines={5}>
                        "{initialData.text || "No text extracted"}"
                    </Text>
                </View>

                <Button
                    variant="primary"
                    className="mt-xl"
                    onPress={handleConfirm}
                    loading={loading}
                >
                    Confirm & Save
                </Button>

                <TouchableOpacity
                    className="mt-lg items-center py-md"
                    onPress={() => router.back()}
                >
                    <Text className="text-text-tertiary font-medium">Try Scanning Again</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
