import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePrivacy } from '../../hooks/usePrivacy';
import { colors } from '../../constants/Colors';
import { Icon } from '../ui/Icon';
import Animated, { FadeIn } from 'react-native-reanimated';

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { settings, loading, authenticate } = usePrivacy();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!loading) {
            checkAuth();
        }
    }, [loading, settings.biometricEnabled]);

    const checkAuth = async () => {
        if (!settings.biometricEnabled) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
        }

        const success = await authenticate();
        if (success) {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    };

    const handleRetry = async () => {
        setIsChecking(true);
        const success = await authenticate();
        if (success) {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    };

    if (loading || isChecking) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            </View>
        );
    }

    if (!isAuthenticated && settings.biometricEnabled) {
        return (
            <Animated.View entering={FadeIn} style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Icon name="lock" size={64} color={colors.primary.DEFAULT} />
                    </View>
                    <Text style={styles.title}>Pillara is Locked</Text>
                    <Text style={styles.subtitle}>Please authenticate to continue</Text>

                    <TouchableOpacity style={styles.button} onPress={handleRetry}>
                        <Text style={styles.buttonText}>Unlock App</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: `${colors.primary.DEFAULT}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        color: colors.text.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: colors.text.tertiary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: colors.primary.DEFAULT,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
    },
    buttonText: {
        color: colors.background.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
