import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FormInput } from "../../../../components/form/FormInput";
import { Button } from "../../../../components/ui/Button";
import Animated, { FadeInDown } from "react-native-reanimated";

export function HealthProfileScreen() {
    const router = useRouter();
    const [bloodType, setBloodType] = useState("O+");
    const [allergies, setAllergies] = useState("Penicillin, Peanuts");
    const [conditions, setConditions] = useState("Hypertension, Type 2 Diabetes");
    const [errors, setErrors] = useState<{ allergies?: string; conditions?: string }>({});

    const validate = () => {
        const newErrors: { allergies?: string; conditions?: string } = {};
        if (!allergies.trim()) newErrors.allergies = "Allergies information is required. Enter 'None' if applicable.";
        if (!conditions.trim()) newErrors.conditions = "Medical conditions are required. Enter 'None' if applicable.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        // Logic to save health profile
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center p-4 mt-2">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Text className="text-primary text-lg">← Back</Text>
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-4">Health Profile</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                    <View className="p-4 bg-background-secondary rounded-2xl mb-6 border border-ui-border">
                        <Text className="text-text-secondary text-sm mb-2">Note</Text>
                        <Text className="text-text-primary">
                            This information helps us check for potential drug interactions.
                        </Text>
                    </View>

                    <FormInput
                        label="Blood Type"
                        value={bloodType}
                        onChangeText={setBloodType}
                        placeholder="e.g. O+"
                    />

                    <FormInput
                        label="Allergies"
                        value={allergies}
                        onChangeText={(text) => {
                            setAllergies(text);
                            if (errors.allergies) setErrors({ ...errors, allergies: undefined });
                        }}
                        placeholder="Separate with commas"
                        multiline
                        error={errors.allergies}
                    />

                    <FormInput
                        label="Medical Conditions"
                        value={conditions}
                        onChangeText={(text) => {
                            setConditions(text);
                            if (errors.conditions) setErrors({ ...errors, conditions: undefined });
                        }}
                        placeholder="Separate with commas"
                        multiline
                        error={errors.conditions}
                    />

                    <Button
                        variant="primary"
                        className="mt-8"
                        onPress={handleSave}
                    >
                        Save Health Profile
                    </Button>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
