import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HealthProfile {
    bloodType?: string;
    allergies: string[];
    conditions: string[];
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

export interface NotificationPreferences {
    medicationReminders: boolean;
    refillAlerts: boolean;
    weeklySummary: boolean;
    newsUpdates: boolean;
}

export interface ConsentInfo {
    dataStorage: boolean;
    timestamp?: string;
    version?: string;
}

export interface UserProfile {
    personalInfo: {
        name: string;
        email: string;
        phone?: string;
        dateOfBirth?: string;
        age?: number;
        profilePictureUrl?: string;
    };
    healthProfile: HealthProfile;
    preferences: NotificationPreferences;
    consentInfo: ConsentInfo;
    isPremium: boolean;
}

const PROFILE_STORAGE_KEY = '@pillara_profile';

const DEFAULT_PROFILE: UserProfile = {
    personalInfo: {
        name: '',
        email: '',
    },
    healthProfile: {
        allergies: [],
        conditions: [],
    },
    preferences: {
        medicationReminders: true,
        refillAlerts: true,
        weeklySummary: false,
        newsUpdates: false,
    },
    consentInfo: {
        dataStorage: false,
    },
    isPremium: false,
};

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load profile from storage
    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setProfile(parsed);
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    // Save profile to storage
    const saveProfile = useCallback(async (profileData: UserProfile) => {
        try {
            await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        } catch (err) {
            console.error('Error saving profile:', err);
            throw new Error('Failed to save profile');
        }
    }, []);

    // Update personal information
    const updatePersonalInfo = useCallback(async (updates: Partial<UserProfile['personalInfo']>) => {
        try {
            const updated = {
                ...profile,
                personalInfo: { ...profile.personalInfo, ...updates },
            };
            setProfile(updated);
            await saveProfile(updated);
        } catch (err) {
            setError('Failed to update personal information');
            throw err;
        }
    }, [profile, saveProfile]);

    // Update health profile
    const updateHealthProfile = useCallback(async (updates: Partial<HealthProfile>) => {
        try {
            const updated = {
                ...profile,
                healthProfile: { ...profile.healthProfile, ...updates },
            };
            setProfile(updated);
            await saveProfile(updated);
        } catch (err) {
            setError('Failed to update health profile');
            throw err;
        }
    }, [profile, saveProfile]);

    // Update notification preferences
    const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
        try {
            const updated = {
                ...profile,
                preferences: { ...profile.preferences, ...updates },
            };
            setProfile(updated);
            await saveProfile(updated);
        } catch (err) {
            setError('Failed to update preferences');
            throw err;
        }
    }, [profile, saveProfile]);

    // Update consent information
    const updateConsent = useCallback(async (consent: Partial<ConsentInfo>) => {
        try {
            const updated = {
                ...profile,
                consentInfo: {
                    ...profile.consentInfo,
                    ...consent,
                    timestamp: new Date().toISOString(),
                    version: '1.0'
                },
            };
            setProfile(updated);
            await saveProfile(updated);
        } catch (err) {
            setError('Failed to update consent information');
            throw err;
        }
    }, [profile, saveProfile]);

    // Set premium status
    const setPremiumStatus = useCallback(async (isPremium: boolean) => {
        try {
            const updated = {
                ...profile,
                isPremium,
            };
            setProfile(updated);
            await saveProfile(updated);
        } catch (err) {
            setError('Failed to update premium status');
            throw err;
        }
    }, [profile, saveProfile]);

    // Add allergy
    const addAllergy = useCallback(async (allergy: string) => {
        try {
            const allergies = [...profile.healthProfile.allergies, allergy];
            await updateHealthProfile({ allergies });
        } catch (err) {
            setError('Failed to add allergy');
            throw err;
        }
    }, [profile.healthProfile.allergies, updateHealthProfile]);

    // Remove allergy
    const removeAllergy = useCallback(async (allergy: string) => {
        try {
            const allergies = profile.healthProfile.allergies.filter(a => a !== allergy);
            await updateHealthProfile({ allergies });
        } catch (err) {
            setError('Failed to remove allergy');
            throw err;
        }
    }, [profile.healthProfile.allergies, updateHealthProfile]);

    // Add condition
    const addCondition = useCallback(async (condition: string) => {
        try {
            const conditions = [...profile.healthProfile.conditions, condition];
            await updateHealthProfile({ conditions });
        } catch (err) {
            setError('Failed to add condition');
            throw err;
        }
    }, [profile.healthProfile.conditions, updateHealthProfile]);

    // Remove condition
    const removeCondition = useCallback(async (condition: string) => {
        try {
            const conditions = profile.healthProfile.conditions.filter(c => c !== condition);
            await updateHealthProfile({ conditions });
        } catch (err) {
            setError('Failed to remove condition');
            throw err;
        }
    }, [profile.healthProfile.conditions, updateHealthProfile]);

    // Load profile on mount
    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return {
        profile,
        loading,
        error,
        updatePersonalInfo,
        updateHealthProfile,
        updatePreferences,
        updateConsent,
        setPremiumStatus,
        addAllergy,
        removeAllergy,
        addCondition,
        removeCondition,
        refresh: loadProfile,
    };
}
