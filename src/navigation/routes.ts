/**
 * Type-safe route definitions for the Pillara application
 * Use these constants and helpers for navigation to ensure type safety
 */

// Main route paths
export const ROUTES = {
    // Auth routes
    HOME: '/',
    LOGIN: '/login',
    PHONE_LOGIN: '/phone-login',
    VERIFY_OTP: '/verify-otp',
    ONBOARDING: '/onboarding',

    // Tab routes
    TABS: {
        INDEX: '/(tabs)',
        MEDICATIONS: '/(tabs)/medications',
        LOGS: '/(tabs)/logs',
        COMMUNITY: '/(tabs)/community',
        PROFILE: '/(tabs)/profile',
    },

    // Medication routes
    MEDICATION: {
        DETAIL: (id: string) => `/medication/${id}` as const,
        ADD: '/medication/add',
        EDIT: (id: string) => `/medication/edit/${id}` as const,
    },

    // Profile routes
    PROFILE: {
        PERSONAL_INFO: '/profile/personal-info',
        HEALTH: '/profile/health',
        NOTIFICATIONS: '/profile/notifications',
        HELP: '/profile/help',
    },

    // Other routes
    SCAN: '/scan',
    SCAN_SUCCESS: '/scan-success',
    STYLE_GUIDE: '/style-guide',
    MOOD_TRACKER: '/mood-tracker',
    WEARABLE_SYNC: '/profile/wearable-sync',
    EMERGENCY: '/emergency',
} as const;

// Route parameter types
export type MedicationDetailParams = {
    id: string;
};

export type MedicationEditParams = {
    id: string;
    mode: 'edit';
};

export type MedicationAddParams = {
    mode: 'add';
};

// Navigation helper types
export type RouteParams = {
    '/medication/[id]': MedicationDetailParams;
    '/medication/add': MedicationAddParams;
    '/medication/edit/[id]': MedicationEditParams;
};

// Type-safe navigation helper
export const navigate = {
    toMedicationDetail: (id: string) => ROUTES.MEDICATION.DETAIL(id),
    toMedicationEdit: (id: string) => ROUTES.MEDICATION.EDIT(id),
    toMedicationAdd: () => ROUTES.MEDICATION.ADD,
    toProfile: () => ROUTES.TABS.PROFILE,
    toCommunity: () => ROUTES.TABS.COMMUNITY,
    toHome: () => ROUTES.HOME,
    toLogin: () => ROUTES.LOGIN,
} as const;

// Route validation helper
export const isValidRoute = (route: string): boolean => {
    const allRoutes = [
        ROUTES.HOME,
        ROUTES.LOGIN,
        ROUTES.PHONE_LOGIN,
        ROUTES.VERIFY_OTP,
        ROUTES.ONBOARDING,
        ROUTES.TABS.INDEX,
        ROUTES.TABS.MEDICATIONS,
        ROUTES.TABS.LOGS,
        ROUTES.TABS.COMMUNITY,
        ROUTES.TABS.PROFILE,
        ROUTES.MEDICATION.ADD,
        ROUTES.PROFILE.PERSONAL_INFO,
        ROUTES.PROFILE.HEALTH,
        ROUTES.PROFILE.NOTIFICATIONS,
        ROUTES.PROFILE.HELP,
        ROUTES.SCAN,
        ROUTES.SCAN_SUCCESS,
        ROUTES.STYLE_GUIDE,
        ROUTES.MOOD_TRACKER,
        ROUTES.WEARABLE_SYNC,
        ROUTES.EMERGENCY,
    ];

    // Check exact matches
    if (allRoutes.includes(route as any)) {
        return true;
    }

    // Check dynamic routes
    if (route.startsWith('/medication/') && route !== '/medication/add') {
        return true;
    }

    return false;
};
