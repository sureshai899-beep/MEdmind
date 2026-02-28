/**
 * Design System - Color Palette
 * Based on the uploaded UI reference screens
 */

export const colors = {
    // Primary Brand Colors
    primary: {
        DEFAULT: '#10D9A5', // Bright teal/mint
        dark: '#0DB88E',
        light: '#5FE8C5',
    },

    // Background Colors
    background: {
        primary: '#0F1E1C', // Dark green-black
        secondary: '#1A2E2A', // Slightly lighter dark green
        tertiary: '#243832', // Card background
        dark: '#1C2B3A', // Navy dark (for favorites screen)
    },

    // Status Colors
    status: {
        taken: '#10D9A5', // Green
        next: '#FF8A3D', // Orange
        missed: '#E74C3C', // Red
        snoozed: '#FFA000', // Amber
        warning: '#F39C12', // Yellow/Orange
        info: '#3498DB',
        critical: '#FF5252',
        emergency: '#7D1F1F',
    },

    // Text Colors
    text: {
        primary: '#FFFFFF',
        secondary: '#A0AEC0',
        tertiary: '#718096',
        accent: '#10D9A5',
        muted: '#4A5568',
    },

    // UI Element Colors
    ui: {
        border: '#2D3748',
        input: '#2A3F3B',
        icon: '#10D9A5',
        iconSecondary: '#4A5568',
    },
} as const;

export type ColorTheme = typeof colors;
