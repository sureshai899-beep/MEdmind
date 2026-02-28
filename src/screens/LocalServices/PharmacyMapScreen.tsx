import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Icon } from '../../components/ui/Icon';

const PHARMACIES = [
    { id: '1', name: 'Apollo Pharmacy', lat: 19.1176, lng: 72.8712, address: 'Andheri East, Mumbai', phone: '022-12345678' },
    { id: '2', name: 'Wellness Forever', lat: 19.1200, lng: 72.8800, address: 'Powai, Mumbai', phone: '022-87654321' },
    { id: '3', name: 'MedPlus', lat: 19.1100, lng: 72.8600, address: 'Andheri West, Mumbai', phone: '022-11223344' },
    { id: '4', name: 'Noble Plus Pharmacy', lat: 19.1250, lng: 72.8750, address: 'Jogeshwari, Mumbai', phone: '022-55667788' },
];

export function PharmacyMapScreen() {
    const router = useRouter();
    const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);

    const initialRegion = {
        latitude: 19.1176,
        longitude: 72.8712,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const handleDirections = (lat: number, lng: number) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${lat},${lng}`,
            android: `geo:0,0?q=${lat},${lng}`,
        });
        if (url) Linking.openURL(url);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-background-tertiary">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Icon name="arrow-back" size={24} className="text-text-primary" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold">Nearby Pharmacies</Text>
                <View className="w-10" />
            </View>

            <View className="flex-1">
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}
                    customMapStyle={mapStyle}
                >
                    {PHARMACIES.map(pharmacy => (
                        <Marker
                            key={pharmacy.id}
                            coordinate={{ latitude: pharmacy.lat, longitude: pharmacy.lng }}
                            onPress={() => setSelectedPharmacy(pharmacy)}
                        >
                            <View className="bg-primary p-2 rounded-full border-2 border-white shadow-lg">
                                <Icon name="cart" size={18} color="white" />
                            </View>
                        </Marker>
                    ))}
                </MapView>

                {selectedPharmacy && (
                    <View className="absolute bottom-10 left-6 right-6 bg-background-secondary p-6 rounded-3xl shadow-2xl border border-primary/20">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1">
                                <Text className="text-text-primary font-bold text-xl">{selectedPharmacy.name}</Text>
                                <Text className="text-text-secondary mt-1">{selectedPharmacy.address}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedPharmacy(null)}>
                                <Icon name="close" size={24} className="text-text-tertiary" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row space-x-4">
                            <TouchableOpacity
                                testID="directions-button"
                                onPress={() => handleDirections(selectedPharmacy.lat, selectedPharmacy.lng)}
                                className="flex-1 bg-primary p-4 rounded-xl flex-row items-center justify-center"
                            >
                                <Icon name="refresh" size={20} color="white" className="mr-2" />
                                <Text className="text-white font-bold">Directions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                testID="call-button"
                                onPress={() => Linking.openURL(`tel:${selectedPharmacy.phone}`)}
                                className="bg-background-tertiary p-4 rounded-xl items-center justify-center w-16"
                            >
                                <Icon name="call" size={20} className="text-primary" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#0F1E1C" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#0F1E1C" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
    },
];
