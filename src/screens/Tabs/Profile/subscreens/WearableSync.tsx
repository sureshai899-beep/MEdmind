import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Icon } from "../../../../components/ui/Icon";
import Animated, { FadeInDown } from "react-native-reanimated";

export function WearableSyncScreen() {
    const router = useRouter();
    const [appleWatch, setAppleWatch] = useState(false);
    const [galaxyWatch, setGalaxyWatch] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-row items-center p-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Icon name="arrow-back" size={24} color="#10D9A5" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-4">Wearable Sync</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                <Animated.View entering={FadeInDown.duration(600)}>
                    <Text className="text-text-secondary text-base mb-8">
                        Mirror your medication reminders and health alerts to your smartwatch for quick access.
                    </Text>

                    <View className="bg-background-secondary p-6 rounded-3xl mb-4 border border-ui-border">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-4">
                                <Icon name="logo-apple" size={32} color="#FFFFFF" />
                                <View>
                                    <Text className="text-text-primary text-lg font-bold">Apple Watch</Text>
                                    <Text className="text-text-tertiary">Requires WatchOS 8+</Text>
                                </View>
                            </View>
                            <Switch
                                value={appleWatch}
                                onValueChange={setAppleWatch}
                                trackColor={{ false: "#2D3748", true: "#10D9A5" }}
                            />
                        </View>
                    </View>

                    <View className="bg-background-secondary p-6 rounded-3xl mb-8 border border-ui-border">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-4">
                                <Icon name="watch" size={32} color="#FFFFFF" />
                                <View>
                                    <Text className="text-text-primary text-lg font-bold">Galaxy Watch</Text>
                                    <Text className="text-text-tertiary">Requires WearOS or Tizen</Text>
                                </View>
                            </View>
                            <Switch
                                value={galaxyWatch}
                                onValueChange={setGalaxyWatch}
                                trackColor={{ false: "#2D3748", true: "#10D9A5" }}
                            />
                        </View>
                    </View>

                    <View className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
                        <Text className="text-primary font-bold mb-2">How it works:</Text>
                        <Text className="text-text-secondary text-sm leading-5">
                            Once enabled, Pillara will automatically sync your active prescription schedules with your paired wearable.
                            You can mark doses as "Taken" or "Snooze" directly from your wrist.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
