import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface ScanInstructionBoxProps {
    instruction: string;
}

export const ScanInstructionBox: React.FC<ScanInstructionBoxProps> = ({
    instruction,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.emoji}>💡</Text>
            </View>
            <Text style={styles.text}>
                {instruction}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
        borderWidth: 1,
        borderColor: '#2D3748',
        borderRadius: 20,
        padding: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(16, 217, 165, 0.2)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emoji: {
        fontSize: 20,
    },
    text: {
        flex: 1,
        color: '#A0AEC0',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
});
