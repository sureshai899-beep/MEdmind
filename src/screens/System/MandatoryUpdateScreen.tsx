import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/ui/Icon';
import * as Linking from 'expo-linking';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';

export function MandatoryUpdateScreen() {
    const handleUpdate = () => {
        // Open App Store or Play Store
        const url = 'https://pillara.app/update';
        Linking.openURL(url);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary justify-center px-10">
            <Animated.View
                entering={BounceIn.duration(1000)}
                className="items-center mb-10"
            >
                <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-6">
                    <Icon name="refresh" size={48} className="text-primary" />
                </View>
                <Text className="text-text-primary text-3xl font-black text-center mb-4">Time for an Update!</Text>
                <Text className="text-text-secondary text-center leading-relaxed">
                    We've made some critical improvements to ensure your medication tracking remains safe and secure. Please update to the latest version to continue.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).duration(800)}>
                <TouchableOpacity
                    onPress={handleUpdate}
                    className="bg-primary p-5 rounded-2xl shadow-xl shadow-primary/40 items-center justify-center mb-6"
                >
                    <Text className="text-white font-bold text-lg">Update Now</Text>
                </TouchableOpacity>

                <View className="bg-background-secondary p-4 rounded-xl border border-background-tertiary">
                    <View className="flex-row items-center mb-2">
                        <Icon name="info" size={16} className="text-primary mr-2" />
                        <Text className="text-text-primary font-bold text-xs uppercase">What's New in v1.2.0</Text>
                    </View>
                    <Text className="text-text-secondary text-xs">• Enhanced Drug Interaction Database</Text>
                    <Text className="text-text-secondary text-xs">• Improved OCR Accuracy</Text>
                    <Text className="text-text-secondary text-xs">• Reduced Battery Consumption</Text>
                </View>
            </Animated.View>

            <View className="absolute bottom-10 left-0 right-0 items-center">
                <Text className="text-text-tertiary text-xs">Pillara Version 1.1.8 (Build 42)</Text>
            </View>
        </SafeAreaView>
    );
}
