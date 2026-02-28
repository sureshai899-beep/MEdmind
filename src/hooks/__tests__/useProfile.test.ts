import { renderHook, act } from '@testing-library/react-native';
import { useProfile } from '../useProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('useProfile', () => {
    const mockProfile = {
        personalInfo: { name: 'Jane Doe', email: 'jane@example.com' },
        healthProfile: { allergies: ['Peanuts'], conditions: [] },
        preferences: { medicationReminders: true, refillAlerts: true, weeklySummary: false, newsUpdates: false },
        consentInfo: { dataStorage: true },
        isPremium: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    });

    it('should load default profile if none stored', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        expect(result.current.profile.personalInfo.name).toBe('');
        expect(result.current.loading).toBe(false);
    });

    it('should load stored profile on mount', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockProfile));
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        expect(result.current.profile).toEqual(mockProfile);
    });

    it('should update personal information', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        await act(async () => {
            await result.current.updatePersonalInfo({ name: 'New Name' });
        });

        expect(result.current.profile.personalInfo.name).toBe('New Name');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should update health profile (allergies)', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        await act(async () => {
            await result.current.addAllergy('Latex');
        });

        expect(result.current.profile.healthProfile.allergies).toContain('Latex');

        await act(async () => {
            await result.current.removeAllergy('Latex');
        });
        expect(result.current.profile.healthProfile.allergies).not.toContain('Latex');
    });

    it('should update health profile (conditions)', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        await act(async () => {
            await result.current.addCondition('Asthma');
        });

        expect(result.current.profile.healthProfile.conditions).toContain('Asthma');

        await act(async () => {
            await result.current.removeCondition('Asthma');
        });
        expect(result.current.profile.healthProfile.conditions).not.toContain('Asthma');
    });

    it('should update preferences', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        await act(async () => {
            await result.current.updatePreferences({ weeklySummary: true });
        });

        expect(result.current.profile.preferences.weeklySummary).toBe(true);
    });

    it('should update consent with timestamp', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        await act(async () => {
            await result.current.updateConsent({ dataStorage: true });
        });

        expect(result.current.profile.consentInfo.dataStorage).toBe(true);
        expect(result.current.profile.consentInfo.timestamp).toBeDefined();
    });

    it('should set premium status', async () => {
        const { result } = renderHook(() => useProfile());
        await act(async () => { });

        await act(async () => {
            await result.current.setPremiumStatus(true);
        });

        expect(result.current.profile.isPremium).toBe(true);
    });
});
