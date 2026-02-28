import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FormInput } from '../../components/form/FormInput';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/Colors';

export function PhoneLoginScreen() {
    const router = useRouter();
    const { loginWithPhone, loading } = useAuth();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | undefined>();

    const handleSendOTP = async () => {
        if (!phone.trim()) {
            setError('Phone number is required');
            return;
        }
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        const result = await loginWithPhone(phone);
        if (result.success) {
            router.push({
                pathname: '/verify-otp',
                params: {
                    verificationId: result.verificationId || '',
                    phoneNumber: phone
                }
            });
        } else {
            Alert.alert('Error', result.error || 'Failed to send verification code');
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
                            Phone Login
                        </Text>
                        <Text className="text-text-secondary text-body-lg">
                            Enter your phone number to receive a verification code.
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                        <FormInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(text);
                                if (error) setError(undefined);
                            }}
                            placeholder="+1 (555) 000-0000"
                            keyboardType="phone-pad"
                            error={error}
                            autoCapitalize="none"
                        />

                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-md"
                            onPress={handleSendOTP}
                            loading={loading}
                            disabled={loading}
                        >
                            Send Verification Code
                        </Button>

                        <View className="mt-xl items-center">
                            <Text className="text-text-tertiary text-caption text-center">
                                By continuing, you may receive an SMS for verification. Message and data rates may apply.
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
