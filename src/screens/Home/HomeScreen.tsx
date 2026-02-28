import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence
} from 'react-native-reanimated';
import { Button, Icon } from "../../components";
import { colors } from "../../constants/Colors";
import { useAuth } from "../../hooks/useAuth";

export function HomeScreen() {
    const router = useRouter();
    const { hasOnboarded, loading } = useAuth();

    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(20);
    const floatAnim = useSharedValue(0);

    useEffect(() => {
        fadeAnim.value = withTiming(1, { duration: 1000 });
        slideAnim.value = withTiming(0, { duration: 800 });

        // Floating pill animation
        floatAnim.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 1500 }),
                withTiming(0, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [{ translateY: slideAnim.value }],
    }));

    const floatingStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatAnim.value }],
    }));

    const handleGetStarted = () => {
        if (!hasOnboarded) {
            router.push("/onboarding");
        } else {
            router.push("/login");
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
                <Text className="text-text-secondary">Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-primary justify-center items-center" edges={['top', 'bottom', 'left', 'right']}>
            <Animated.View className="items-center w-full px-6" style={animatedStyle}>
                <Animated.View
                    className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-lg shadow-2xl"
                    style={floatingStyle}
                >
                    <Icon name="pill" size={56} color={colors.background.primary} />
                </Animated.View>

                <Text className="text-h1 text-text-primary tracking-tighter">
                    Pillara
                </Text>
                <Text className="text-body-lg text-text-secondary mt-xs text-center px-xl leading-6">
                    Smart Medication Management & Interaction Guide
                </Text>

                <View className="mt-2xl w-full px-lg space-y-md">
                    <Button
                        size="lg"
                        className="w-full"
                        onPress={handleGetStarted}
                    >
                        Get Started
                    </Button>

                    <Button
                        variant="ghost"
                        className="mt-lg"
                        onPress={() => {
                            if (!hasOnboarded) {
                                router.push("/onboarding");
                            } else {
                                router.push("/(tabs)");
                            }
                        }}
                    >
                        Skip to Dashboard
                    </Button>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}
