import "../../global.css";
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import { initSentry, Sentry } from '../services/sentry';

import { AuthGate } from '../components/auth/AuthGate';
import { colors } from '../constants/Colors';

// Initialize Sentry
initSentry();

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Initialize QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ErrorBoundary>
                    <SafeAreaProvider>
                        <AuthGate>
                            <View className="flex-1" style={{ backgroundColor: colors.background.primary, flex: 1 }}>
                                <StatusBar style="light" />
                                <Stack screenOptions={{ headerShown: false }} />
                            </View>
                        </AuthGate>
                    </SafeAreaProvider>
                </ErrorBoundary>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}
