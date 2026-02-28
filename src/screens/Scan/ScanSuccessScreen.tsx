import React from 'react';
import { SuccessScreen } from '../../components';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export function ScanSuccessScreen() {
    const router = useRouter();

    return (
        <SuccessScreen
            icon={<Text style={{ fontSize: 48 }}>✅</Text>}
            title="Medication Found"
            message="We've successfully extracted the details for Lisinopril 10mg. You can now add it to your schedule."
            primaryAction={{
                label: "Add to Schedule",
                onPress: () => router.replace('/(tabs)')
            }}
            secondaryAction={{
                label: "Edit Details",
                onPress: () => router.push('/medication/NewScannedMed')
            }}
        />
    );
}
