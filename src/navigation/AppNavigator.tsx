import { router } from 'expo-router';

export const navigation = {
    toHome: () => router.push('/' as any),
    toMedications: () => router.push('/(tabs)/medications' as any),
    toLogs: () => router.push('/(tabs)/logs' as any),
    toCommunity: () => router.push('/(tabs)/community' as any),
    toProfile: () => router.push('/(tabs)/profile' as any),
    toAddMedication: () => router.push('/medication/add' as any),
};
