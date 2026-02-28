import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../../../../constants/Colors";
import { Icon } from "../../../../components";
import { usePrivacy } from "../../../../hooks/usePrivacy";
import Animated, { FadeInDown } from "react-native-reanimated";

export function PrivacySettingsScreen() {
    const router = useRouter();
    const { settings, loading, isBiometricSupported, toggleBiometric } = usePrivacy();

    const handleToggleBiometric = async (value: boolean) => {
        if (!isBiometricSupported && value) {
            Alert.alert("Not Supported", "Biometric authentication is not supported on this device.");
            return;
        }

        const success = await toggleBiometric(value);
        if (!success && value) {
            Alert.alert("Authentication Failed", "Could not verify identity. Biometric lock was not enabled.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center p-4 mt-2">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Icon name="arrow-back" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-4">Privacy & Security</Text>
            </View>

            <ScrollView className="flex-1 px-6 mt-4">
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                    <View className="bg-background-secondary p-4 rounded-2xl border border-ui-border mb-6">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-4">
                                <Text className="text-text-primary text-lg font-bold">Biometric Lock</Text>
                                <Text className="text-text-tertiary text-sm mt-1">
                                    Use FaceID or TouchID to unlock Pillara for extra security.
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#2D3748", true: colors.primary.DEFAULT }}
                                thumbColor={settings.biometricEnabled ? "#ffffff" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleToggleBiometric}
                                value={settings.biometricEnabled}
                                disabled={loading || !isBiometricSupported}
                            />
                        </View>
                        {!isBiometricSupported && (
                            <View className="mt-4 p-3 bg-status-missed/10 rounded-xl flex-row items-center">
                                <Icon name="warning" size={16} color={colors.status.missed} />
                                <Text className="text-status-missed text-xs ml-2 flex-1">
                                    Biometric hardware not detected or available.
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-text-tertiary text-xs font-bold uppercase mb-4 px-2">
                        Data Privacy
                    </Text>

                    <View className="bg-background-secondary rounded-2xl border border-ui-border overflow-hidden">
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-ui-border">
                            <View className="flex-row items-center">
                                <Icon name="lock" size={20} color={colors.text.secondary} />
                                <Text className="text-text-primary text-base ml-3">Privacy Policy</Text>
                            </View>
                            <Icon name="arrow-forward" size={18} color={colors.text.tertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <Icon name="trash" size={20} color={colors.status.missed} />
                                <Text className="text-status-missed text-base ml-3">Clear App Data</Text>
                            </View>
                            <Icon name="arrow-forward" size={18} color={colors.text.tertiary} />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-text-tertiary text-xs mt-6 text-center px-4">
                        Pillara secures your health data locally. We do not share your biometric data with our servers.
                    </Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
