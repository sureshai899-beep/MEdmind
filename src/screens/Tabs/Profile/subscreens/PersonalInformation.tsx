import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FormInput } from "../../../../components/form/FormInput"; // Adjusted path
import { Button } from "../../../../components/ui/Button"; // Adjusted path
import { Icon } from "../../../../components/ui/Icon";
import { colors } from "../../../../constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";

export function PersonalInformationScreen() {
    const router = useRouter();
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [phone, setPhone] = useState("+1 234 567 8900");
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; email?: string } = {};
        if (!name.trim()) newErrors.name = "Name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        // Save logic here
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center px-md py-md mt-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    accessibilityHint="Navigate to previous screen"
                    className="w-10 h-10 items-center justify-center rounded-full bg-background-secondary"
                >
                    <Text className="text-primary text-xl font-bold">←</Text>
                </TouchableOpacity>
                <Text className="text-text-primary text-h3 ml-md">Personal Information</Text>
            </View>

            <ScrollView className="flex-1 px-lg">
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                    <View className="items-center my-6">
                        <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-2">
                            <Icon name="person" size={48} color={colors.primary.DEFAULT} />
                        </View>
                        <Text className="text-text-primary text-lg font-semibold">Edit Profile Photo</Text>
                    </View>

                    <FormInput
                        label="Full Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        error={errors.name}
                    />

                    <FormInput
                        label="Email Address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        error={errors.email}
                    />

                    <FormInput
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Button
                        variant="primary"
                        className="mt-8"
                        onPress={handleSave}
                    >
                        Save Changes
                    </Button>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
