import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Pillara',
    slug: 'pillara',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'pillara',
    userInterfaceStyle: 'dark',
    splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0F1E1C',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.vibhor.pillara',
        infoPlist: {
            NSCameraUsageDescription: 'Allow Pillara to access your camera to scan medication labels and identify dosages.',
            NSNotificationsUsageDescription: 'Allow Pillara to send you reminders for your medications.',
            NSFaceIDUsageDescription: 'Allow Pillara to use FaceID for secure access.',
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#0F1E1C',
        },
        package: 'com.vibhor.pillara',
        permissions: [
            'CAMERA',
            'NOTIFICATIONS',
            'USE_BIOMETRIC',
            'USE_FINGERPRINT'
        ],
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/favicon.png',
    },
    plugins: [
        'expo-router',
        'expo-sqlite',
        'expo-camera',
        'expo-local-authentication',
        [
            'expo-notifications',
            {
                icon: './assets/icon.png',
                color: '#10D9A5',
            },
        ],
        '@sentry/react-native',
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        eas: {
            projectId: 'your-project-id',
        },
    },
});
