import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormInput } from '../../components/form/FormInput';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/Colors';

export function VerifyOTPScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ verificationId: string; phoneNumber: string }>();
    const { verifyOTP, loading } = useAuth();

    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | undefined>();

    const handleVerify = async () => {
        if (!otp || otp.length < 6) {
            setError('Enter the 6-digit code');
            return;
        }

        const result = await verifyOTP(params.verificationId || '', otp);
        if (result.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Verification Failed', result.error || 'The code you entered is invalid');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
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
                        className="mt-xl mb-lg"
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mb-lg w-10 h-10 rounded-full bg-background-secondary items-center justify-center border border-ui-border"
                            testID="back-button"
                        >
                            <Icon name="arrow-back" size={20} color={colors.text.primary} />
                        </TouchableOpacity>

                        <Text className="text-h1 text-text-primary mb-xs">
                            Verify Identity
                        </Text>
                        <Text className="text-text-secondary text-body-lg">
                            Enter the 6-digit code sent to {params.phoneNumber || 'your phone'}.
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                        <FormInput
                            label="Verification Code"
                            value={otp}
                            onChangeText={(text) => {
                                setOtp(text);
                                if (error) setError(undefined);
                            }}
                            placeholder="123456"
                            keyboardType="number-pad"
                            maxLength={6}
                            error={error}
                        />

                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-md"
                            onPress={handleVerify}
                            loading={loading}
                            disabled={loading}
                        >
                            Verify & Continue
                        </Button>

                        <TouchableOpacity
                            className="mt-lg items-center"
                            onPress={() => router.back()}
                        >
                            <Text className="text-primary font-bold text-body">
                                Resend Code
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
