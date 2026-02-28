import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMedications } from "../../hooks/useMedications";
import { FormInput } from "../../components/form/FormInput";
import { Button } from "../../components/ui/Button";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MedicationSchema } from "../../utils/schemas";
import { z } from "zod";

export function MedicationFormScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mode = params.mode === 'edit' ? 'Edit' : 'Add';
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { addMedication, updateMedication, getMedicationById } = useMedications();

    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [purpose, setPurpose] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    useEffect(() => {
        if (mode === 'Edit' && id) {
            const medication = getMedicationById(id);
            if (medication) {
                setName(medication.name);
                setDosage(medication.dosage);
                setFrequency(medication.frequency);
                setPurpose(medication.purpose || "");
            }
        }
    }, [mode, id, getMedicationById]);

    const handleSave = async () => {
        try {
            setLoading(true);
            setErrors({});

            const NewMedicationSchema = MedicationSchema.omit({
                id: true,
                createdAt: true,
                updatedAt: true
            });

            const validationResult = NewMedicationSchema.safeParse({
                name,
                dosage,
                frequency,
                purpose,
                schedule: frequency,
                status: 'Active',
            });

            if (!validationResult.success) {
                const newErrors: { [key: string]: string } = {};
                validationResult.error.errors.forEach((err: any) => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            if (mode === 'Edit' && id) {
                await updateMedication(id, { name, dosage, frequency, purpose });
                Alert.alert('Success', 'Medication updated successfully');
            } else {
                await addMedication({
                    name,
                    dosage,
                    frequency,
                    purpose,
                    schedule: frequency,
                    status: 'Active',
                });
                Alert.alert('Success', 'Medication added successfully');
            }
            router.back();
        } catch (error: any) {
            Alert.alert('Error', 'Failed to save medication. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center px-md py-md mt-2">
                <TouchableOpacity onPress={() => router.back()} testID="back-button" className="w-10 h-10 items-center justify-center rounded-full bg-background-secondary">
                    <Text className="text-primary text-xl font-bold">←</Text>
                </TouchableOpacity>
                <Text className="text-text-primary text-h3 ml-md">{mode} Medication</Text>
            </View>

            <ScrollView className="flex-1 px-lg">
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                    <Text className="text-text-secondary text-body mb-lg">
                        {mode === 'Add'
                            ? "Enter the details of the medication you want to track."
                            : "Update the details of your medication."}
                    </Text>

                    <FormInput
                        label="Medication Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="e.g. Lisinopril"
                        testID="input-medication-name"
                        error={errors.name}
                    />

                    <FormInput
                        label="Dosage"
                        value={dosage}
                        onChangeText={(text) => {
                            setDosage(text);
                            if (errors.dosage) setErrors({ ...errors, dosage: undefined });
                        }}
                        placeholder="e.g. 10mg"
                        testID="input-dosage"
                        error={errors.dosage}
                    />

                    <FormInput
                        label="Frequency"
                        value={frequency}
                        onChangeText={setFrequency}
                        placeholder="e.g. Once daily"
                        testID="input-frequency"
                    />

                    <FormInput
                        label="Purpose (Optional)"
                        value={purpose}
                        onChangeText={setPurpose}
                        placeholder="e.g. Blood Pressure"
                        testID="input-purpose-(optional)"
                    />

                    <Button
                        variant="primary"
                        className="mt-8"
                        onPress={handleSave}
                        testID="save-button"
                        loading={loading}
                        disabled={loading}
                    >
                        {mode === 'Edit' ? 'Update Medication' : 'Save Medication'}
                    </Button>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
