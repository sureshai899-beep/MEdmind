import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Icon } from '../../components/ui/Icon';
import Animated, { FadeInUp } from 'react-native-reanimated';

const TELEHEALTH_PARTNERS = [
    {
        id: '1',
        name: 'Practo',
        specialty: 'General Consultation',
        url: 'https://www.practo.com/consult',
        logo: 'https://www.practo.com/favicon.ico',
        color: '#28328c',
    },
    {
        id: '2',
        name: 'Tata 1mg',
        specialty: 'Pharmacy & Consultation',
        url: 'https://www.1mg.com/online-doctor-consultation',
        logo: 'https://www.1mg.com/favicon.ico',
        color: '#ff6f61',
    },
    {
        id: '3',
        name: 'Apollo 24|7',
        specialty: 'Expert Advice',
        url: 'https://www.apollo247.com/',
        logo: 'https://www.apollo247.com/favicon.ico',
        color: '#004c3f',
    },
];

export function TelehealthScreen() {
    const router = useRouter();

    const handleOpenPartner = async (url: string) => {
        await WebBrowser.openBrowserAsync(url);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-6 py-4 flex-row items-center border-b border-background-tertiary">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Icon name="arrow-back" size={24} className="text-text-primary" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-2">Telehealth Portal</Text>
            </View>

            <ScrollView className="px-6 flex-1 pt-6">
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text className="text-text-primary text-2xl font-black mb-2">Connect with Doctors</Text>
                    <Text className="text-text-secondary mb-8">Access professional medical advice instantly through our trusted telehealth partners.</Text>
                </Animated.View>

                {TELEHEALTH_PARTNERS.map((partner, index) => (
                    <Animated.View
                        key={partner.id}
                        entering={FadeInUp.delay(200 + index * 100).duration(600)}
                    >
                        <TouchableOpacity
                            onPress={() => handleOpenPartner(partner.url)}
                            className="bg-background-secondary p-6 rounded-3xl mb-4 border border-background-tertiary flex-row items-center"
                        >
                            <View
                                style={{ backgroundColor: partner.color }}
                                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                            >
                                <Icon name="medical" size={24} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-text-primary text-lg font-bold">{partner.name}</Text>
                                <Text className="text-text-secondary text-sm">{partner.specialty}</Text>
                            </View>
                            <Icon name="arrow-forward" size={20} className="text-text-tertiary" />
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                <Animated.View
                    entering={FadeInUp.delay(600).duration(600)}
                    className="bg-background-tertiary/20 p-6 rounded-3xl border border-dashed border-background-tertiary mt-4 mb-10"
                >
                    <Text className="text-text-primary font-bold mb-2">Notice</Text>
                    <Text className="text-text-secondary text-xs leading-relaxed">
                        Pillara is an aggregator for telehealth services. We do not provide direct medical advice.
                        Please consult with a qualified healthcare professional for emergency medical conditions.
                    </Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
