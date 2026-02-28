import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { DrugDetailHeader, AIPoweredSummaryCard, Button, Icon } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMedications } from '../../hooks/useMedications';
import { drugSafetyService, DrugInteraction } from '../../services/drugSafetyService';

export function MedicationDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const medicationId = Array.isArray(id) ? id[0] : id;

    const { medications, getMedicationById, updateMedication } = useMedications();
    const [interactions, setInteractions] = useState<DrugInteraction[]>([]);

    const isNewScanned = medicationId === 'NewScannedMed';

    const currentMed = isNewScanned ? {
        id: 'new',
        name: "Lisinopril (Scanned)",
        dosage: "10mg",
        frequency: "Once daily",
        purpose: "Blood Pressure",
        schedule: "08:00",
        status: "Active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sideEffects: ["Dizziness", "Lightheadedness", "Tiredness", "Headache"],
        storageInstructions: "Store at room temperature away from moisture and heat.",
        contraindications: ["Pregnancy", "History of angioedema"],
        pillImageUri: undefined as string | undefined,
    } : getMedicationById(medicationId || "");

    const medication = currentMed || {
        id: 'fallback',
        name: medicationId || "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        purpose: "Blood Pressure",
        schedule: "08:00",
        status: "Active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sideEffects: ["Common side effects include cough and dizziness."],
        storageInstructions: "Store in a cool, dry place.",
        contraindications: [] as string[],
        pillImageUri: undefined as string | undefined,
    };

    useEffect(() => {
        if (medication && medications.length > 0) {
            drugSafetyService.checkInteractions(medications)
                .then(results => {
                    const relevant = results.filter(i =>
                        i.affectedDrugs.some(d => d.toLowerCase().includes(medication.name.toLowerCase()))
                    );
                    setInteractions(relevant);
                });
        }
    }, [medication, medications]);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && medication.id !== 'new') {
            // Update medication with new image
            await updateMedication(medication.id, { pillImageUri: result.assets[0].uri });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <DrugDetailHeader
                name={medication.name}
                dosage={medication.dosage}
                onBack={() => router.back()}
            />

            <ScrollView className="flex-1 px-4 mt-6" showsVerticalScrollIndicator={false}>
                {/* Interaction Alerts */}
                {interactions.map(interaction => (
                    <View
                        key={interaction.id}
                        className={`mb-6 p-4 rounded-2xl flex-row items-start ${interaction.severity === 'High' ? 'bg-error-light' : 'bg-warning-light'}`}
                        style={{ backgroundColor: interaction.severity === 'High' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(243, 156, 18, 0.1)' }}
                    >
                        <Icon
                            name="warning"
                            size={20}
                            color={interaction.severity === 'High' ? '#E74C3C' : '#F39C12'}
                            style={{ marginTop: 2, marginRight: 12 }}
                        />
                        <View className="flex-1">
                            <Text
                                className="font-bold mb-1"
                                style={{ color: interaction.severity === 'High' ? '#E74C3C' : '#F39C12' }}
                            >
                                {interaction.severity} Interaction Warning
                            </Text>
                            <Text className="text-text-secondary text-sm">
                                {interaction.description}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* Pill Image Section */}
                <View className="mb-6 items-center">
                    <TouchableOpacity
                        onPress={handlePickImage}
                        testID="pill-image-container"
                        className="w-40 h-40 bg-background-secondary rounded-3xl items-center justify-center overflow-hidden border-2 border-dashed border-ui-border"
                    >
                        {medication.pillImageUri ? (
                            <Image source={{ uri: medication.pillImageUri }} className="w-full h-full" />
                        ) : (
                            <View className="items-center">
                                <Icon name="camera" size={32} color="#10D9A5" />
                                <Text className="text-text-tertiary text-xs mt-2">Add Pill Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <AIPoweredSummaryCard
                    title="Clinical Purpose"
                    summary={`${medication.name} is used to treat ${medication.purpose || "your condition"}. It helps improve your health outcomes by managing specific symptoms.`}
                />

                {/* Side Effects Section */}
                <View className="mt-6 p-5 bg-background-secondary rounded-2xl">
                    <View className="flex-row items-center mb-4">
                        <Icon name="pill" size={20} color="#10D9A5" style={{ marginRight: 10 }} />
                        <Text className="text-text-primary text-base font-bold">Common Side Effects</Text>
                    </View>
                    <View className="gap-2">
                        {(medication.sideEffects || ["Consult your pharmacist for a list of side effects."]).map((effect, idx) => (
                            <View key={idx} className="flex-row items-start">
                                <View className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3" />
                                <Text className="text-text-secondary text-base flex-1">{effect}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Dosage & Schedule */}
                <View className="mt-6 p-5 bg-background-secondary rounded-2xl">
                    <View className="flex-row justify-between mb-4">
                        <View>
                            <Text className="text-text-tertiary text-[10px] uppercase font-bold tracking-wider mb-1">Frequency</Text>
                            <Text className="text-text-primary text-base font-bold">{medication.frequency}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-text-tertiary text-[10px] uppercase font-bold tracking-wider mb-1">Dosage</Text>
                            <Text className="text-text-primary text-base font-bold">{medication.dosage}</Text>
                        </View>
                    </View>
                    <View className="h-px bg-ui-border mb-4" />
                    <View className="flex-row items-center">
                        <Icon name="time" size={18} color="#10D9A5" style={{ marginRight: 10 }} />
                        <View>
                            <Text className="text-text-tertiary text-[10px] uppercase font-bold">Next Scheduled Dose</Text>
                            <Text className="text-text-primary text-base font-bold">Tomorrow, 08:00 AM</Text>
                        </View>
                    </View>
                </View>

                {/* Storage Instructions */}
                <View className="mt-6 p-5 bg-background-secondary rounded-2xl border border-primary/10">
                    <View className="flex-row items-center mb-2">
                        <Icon name="medical" size={18} color="#10D9A5" style={{ marginRight: 10 }} />
                        <Text className="text-text-primary text-base font-bold">Storage & Handling</Text>
                    </View>
                    <Text className="text-text-secondary text-base leading-6">
                        {medication.storageInstructions || "Store in a cool, dry place. Keep out of reach of children."}
                    </Text>
                </View>

                {/* Missed Dose Guidance */}
                <View className="mt-6 p-5 bg-orange-50 rounded-2xl border border-orange-100">
                    <View className="flex-row items-center mb-2">
                        <Icon name="warning" size={18} color="#F59E0B" style={{ marginRight: 10 }} />
                        <Text className="text-orange-800 text-base font-bold">Missed Dose Guidance</Text>
                    </View>
                    <Text className="text-orange-700 text-base leading-6">
                        Take the missed dose as soon as you remember. Skip the missed dose if it is almost time for your next scheduled dose. Do not take extra medicine to make up the missed dose.
                    </Text>
                </View>

                {/* Contraindications */}
                {medication.contraindications && (
                    <View className="mt-6 p-5 bg-red-50 rounded-2xl border border-red-100">
                        <View className="flex-row items-center mb-2">
                            <Icon name="close-circle" size={18} color="#EF4444" style={{ marginRight: 10 }} />
                            <Text className="text-red-800 text-base font-bold">Contraindications</Text>
                        </View>
                        <Text className="text-red-700 text-base leading-6">
                            Do not use if you have: {medication.contraindications.join(", ")}
                        </Text>
                    </View>
                )}

                <Button
                    variant="outline"
                    className="mt-8 mb-4"
                    onPress={() => router.push({ pathname: '/medication/form', params: { mode: 'edit', id: medication.id } })}
                >
                    Edit Medication
                </Button>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
