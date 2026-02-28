import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { FormInput } from '../../components/form/FormInput';
import { Button } from '../../components/ui/Button';
import { SocialButtons } from '../../components/auth/SocialButtons';
import { Icon } from '../../components';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/Colors';

export function LoginScreen() {
    const router = useRouter();
    const { loginWithGoogle, loading } = useAuth();

    const handleGoogleLogin = async () => {
        const result = await loginWithGoogle();
        if (result.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Google Login Failed', result.error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-lg"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        entering={FadeInDown.duration(600)}
                        className="mt-2xl mb-xl items-center"
                    >
                        <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center mb-lg shadow-xl">
                            <Icon name="pill" size={48} color={colors.background.primary} />
                        </View>
                        <Text className="text-h1 text-text-primary mb-xs">
                            Welcome to Pillara
                        </Text>
                        <Text className="text-text-secondary text-body-lg text-center px-md">
                            Your personal medication assistant. Sign in to continue.
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                        <SocialButtons
                            onGooglePress={handleGoogleLogin}
                            onPhonePress={() => router.push('/phone-login')}
                            className="mt-6"
                        />

                        <View className="mt-2xl items-center pb-xl">
                            <Link href="/(tabs)" asChild>
                                <TouchableOpacity>
                                    <View className="flex-row items-center">
                                        <Text className="text-text-tertiary text-body font-medium mr-1">
                                            Skip for now
                                        </Text>
                                        <Icon name="arrow-forward" size={16} color={colors.text.tertiary} />
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
