import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../empty-state/EmptyState';
import { useRouter } from 'expo-router';

interface ErrorScreenProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorScreen({
    title = "Something went wrong",
    message = "We encountered an unexpected error. Please try again.",
    onRetry
}: ErrorScreenProps) {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-1 px-4 py-8">
                <EmptyState
                    icon="⚠️"
                    title={title}
                    description={message}
                    actionLabel={onRetry ? "Try Again" : "Go Home"}
                    onAction={onRetry || (() => router.replace('/(tabs)'))}
                />
            </View>
        </SafeAreaView>
    );
}
