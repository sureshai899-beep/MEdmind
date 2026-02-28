import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = width * 0.75;

export const ScanOverlay = () => {
    const opacity = useSharedValue(0.5);
    const scale = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500 }),
                withTiming(0.5, { duration: 1500 })
            ),
            -1,
            true
        );

        scale.value = withRepeat(
            withTiming(1.05, { duration: 2000 }),
            -1,
            true
        );
    }, []);

    const boxStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }]
        };
    });

    const lineStyle = useAnimatedStyle(() => {
        const translateY = interpolate(opacity.value, [0.5, 1], [-SCAN_SIZE / 2, SCAN_SIZE / 2]);
        return {
            transform: [{ translateY }]
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.mask}>
                <View style={styles.maskRow} />
                <View style={[styles.maskCenter, { height: SCAN_SIZE }]}>
                    <View style={styles.maskSide} />
                    <View style={[styles.scanBox, { width: SCAN_SIZE, height: SCAN_SIZE }]}>
                        {/* Corners */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />

                        <Animated.View style={[styles.boxInner, boxStyle]} />
                        <Animated.View style={[styles.scanLine, lineStyle]} />
                    </View>
                    <View style={styles.maskSide} />
                </View>
                <View style={styles.maskRow} />
            </View>

            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>Center the prescription Label</Text>
                <Text style={styles.subInstructionText}>Hold still for automatic detection</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    maskRow: {
        flex: 1,
    },
    maskCenter: {
        flexDirection: 'row',
    },
    maskSide: {
        flex: 1,
    },
    scanBox: {
        backgroundColor: 'transparent',
        position: 'relative',
    },
    boxInner: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 2,
        borderColor: '#10D9A5',
        borderRadius: 24,
    },
    scanLine: {
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        height: 2,
        backgroundColor: '#10D9A5',
        shadowColor: '#10D9A5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#10D9A5',
    },
    topLeft: {
        top: -10,
        left: -10,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 16,
    },
    topRight: {
        top: -10,
        right: -10,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 16,
    },
    bottomLeft: {
        bottom: -10,
        left: -10,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 16,
    },
    bottomRight: {
        bottom: -10,
        right: -10,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 16,
    },
    instructionContainer: {
        position: 'absolute',
        bottom: 120,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    instructionText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subInstructionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
    }
});
