import React from "react";
import { View, StyleSheet } from "react-native";

export interface OnboardingStepperProps {
    totalSteps: number;
    currentStep: number;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
    totalSteps,
    currentStep,
}) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            backgroundColor: index === currentStep ? '#10D9A5' : '#2D3748',
                            width: index === currentStep ? 24 : 8,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});
