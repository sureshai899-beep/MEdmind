import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface AdherenceRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const AdherenceRing: React.FC<AdherenceRingProps> = ({
    percentage,
    size = 120,
    strokeWidth = 12,
    className,
}) => {
    const progress = useSharedValue(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Determine color based on percentage
    const getColor = (pct: number) => {
        if (pct >= 80) return '#10D9A5'; // Green
        if (pct >= 50) return '#F59E0B'; // Yellow/Orange
        return '#EF4444'; // Red
    };

    const color = getColor(percentage);

    useEffect(() => {
        progress.value = withTiming(percentage / 100, {
            duration: 1500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#1A2E2A"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    animatedProps={animatedProps}
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={[styles.percentage, { color }]}>
                    {Math.round(percentage)}%
                </Text>
                <Text style={styles.label}>Adherence</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    svg: {
        position: 'absolute',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentage: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#A0AEC0',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
