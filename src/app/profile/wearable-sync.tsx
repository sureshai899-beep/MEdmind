import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WearableSyncScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
            <Text className="text-text-primary text-xl font-bold">Wearable Sync</Text>
            <Text className="text-text-secondary mt-2">Connect your Apple Watch or Galaxy Watch.</Text>
        </SafeAreaView>
    );
}
