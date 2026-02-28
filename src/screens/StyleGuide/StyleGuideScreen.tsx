import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../../constants/Colors";
import { Button, FormInput, MedicationCard, QuickInfoCard } from "../../components";
import Animated, { FadeInDown } from "react-native-reanimated";

export function StyleGuideScreen() {
    const router = useRouter();

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View className="mb-2xl">
            <Text className="text-primary text-h2 mb-lg border-b border-ui-border pb-xs">{title}</Text>
            {children}
        </View>
    );

    const ColorBox = ({ name, hex, label }: { name: string, hex: string, label: string }) => (
        <View className="flex-row items-center mb-md">
            <View className="w-12 h-12 rounded-xl border border-ui-border mr-md" style={{ backgroundColor: hex }} />
            <View>
                <Text className="text-text-primary text-body font-bold">{label}</Text>
                <Text className="text-text-tertiary text-caption">{hex}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-row items-center px-md py-md border-b border-ui-border">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-background-secondary mr-md"
                >
                    <Text className="text-primary text-xl font-bold">←</Text>
                </TouchableOpacity>
                <Text className="text-text-primary text-h3">Design System Guide</Text>
            </View>

            <ScrollView className="flex-1 px-lg pt-lg">
                <Animated.View entering={FadeInDown.duration(600)}>

                    <Section title="Colors">
                        <Text className="text-text-secondary text-body-sm mb-md uppercase tracking-widest font-bold">Primary & Surface</Text>
                        <ColorBox name="primary" hex={colors.primary.DEFAULT} label="Primary (Brand)" />
                        <ColorBox name="bg-primary" hex={colors.background.primary} label="Background Primary" />
                        <ColorBox name="bg-secondary" hex={colors.background.secondary} label="Background Secondary" />

                        <Text className="text-text-secondary text-body-sm mt-lg mb-md uppercase tracking-widest font-bold">Status</Text>
                        <View className="flex-row flex-wrap gap-md">
                            <ColorBox name="status-taken" hex={colors.status.taken} label="Success" />
                            <ColorBox name="status-next" hex={colors.status.next} label="Warning/Next" />
                            <ColorBox name="status-missed" hex={colors.status.missed} label="Danger/Missed" />
                        </View>
                    </Section>

                    <Section title="Typography">
                        <Text className="text-text-primary text-h1 mb-xs">Heading 1 (h1)</Text>
                        <Text className="text-text-primary text-h2 mb-xs">Heading 2 (h2)</Text>
                        <Text className="text-text-primary text-h3 mb-md">Heading 3 (h3)</Text>
                        <Text className="text-text-primary text-body-lg mb-xs">Body Large (body-lg)</Text>
                        <Text className="text-text-primary text-body mb-xs">Body Regular (body)</Text>
                        <Text className="text-text-secondary text-body-sm mb-xs">Body Small (body-sm)</Text>
                        <Text className="text-text-tertiary text-caption font-semibold uppercase tracking-widest">Caption (caption)</Text>
                    </Section>

                    <Section title="Buttons">
                        <View className="space-y-md">
                            <Button variant="primary">Primary Button</Button>
                            <Button variant="secondary">Secondary Button</Button>
                            <Button variant="outline">Outline Button</Button>
                            <Button variant="ghost">Ghost Button</Button>
                            <Button variant="danger">Danger Button</Button>
                            <View className="flex-row gap-md">
                                <Button size="sm" className="flex-1">Small</Button>
                                <Button size="md" className="flex-1">Medium</Button>
                                <Button size="lg" className="flex-1">Large</Button>
                            </View>
                        </View>
                    </Section>

                    <Section title="Forms">
                        <FormInput label="Standard Input" placeholder="Type something..." value="" onChangeText={() => { }} />
                        <FormInput label="Error State" placeholder="Has error" value="Invalid data" error="This field is required" onChangeText={() => { }} />
                    </Section>

                    <Section title="Cards">
                        <MedicationCard
                            name="Medication Name"
                            dosage="500mg • Twice Daily"
                            status="next"
                            time="08:00 AM"
                            onTake={() => { }}
                            onSnooze={() => { }}
                        />
                        <View className="flex-row gap-md mt-md">
                            <QuickInfoCard title="95%" subtitle="Adherence" className="flex-1" />
                            <QuickInfoCard title="2 Left" subtitle="Doses Today" variant="dark" className="flex-1" />
                        </View>
                    </Section>

                    <View className="h-20" />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
