import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ExpandableSection } from "../../../../components/ui/ExpandableSection";
import { Button } from "../../../../components/ui/Button";
import Animated, { FadeInDown } from "react-native-reanimated";

export function HelpCenterScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center p-4 mt-2">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Text className="text-primary text-lg">← Back</Text>
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-4">Help Center</Text>
            </View>

            <ScrollView className="flex-1 px-6 mt-2">
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                    <Text className="text-text-secondary mb-6">
                        Find answers to common questions or contact our support team.
                    </Text>

                    <ExpandableSection title="How do I add a medication?" icon="💊">
                        <Text className="text-text-secondary leading-6">
                            You can add a medication by tapping the "Scan Med" button on the dashboard, or by manually entering the details via the scan screen.
                        </Text>
                    </ExpandableSection>

                    <ExpandableSection title="How do I change my dosage?" icon="⚖️">
                        <Text className="text-text-secondary leading-6">
                            Go to the medication detail page and tap "Edit Medication". You can update the dosage and frequency there.
                        </Text>
                    </ExpandableSection>

                    <ExpandableSection title="Is my data private?" icon="🔒">
                        <Text className="text-text-secondary leading-6">
                            Yes, your health data is stored securely on your device and is only shared with caregivers you explicitly invite.
                        </Text>
                    </ExpandableSection>

                    <View className="mt-8">
                        <Button
                            variant="primary"
                            onPress={() => console.log('Contact Support')}
                        >
                            Contact Support
                        </Button>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
