import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../../components/ui/Icon';
import Animated, { FadeInUp } from 'react-native-reanimated';

const COMPARISONS = [
    {
        branded: 'Lipitor',
        generic: 'Atorvastatin',
        brandedPrice: 1250,
        genericPrice: 450,
        savings: '64%',
        description: 'Used for lowering high cholesterol and triglyceride levels.',
    },
    {
        branded: 'Glucophage',
        generic: 'Metformin',
        brandedPrice: 450,
        genericPrice: 120,
        savings: '73%',
        description: 'Used to treat high blood sugar levels caused by type 2 diabetes.',
    },
    {
        branded: 'Panadol',
        generic: 'Paracetamol',
        brandedPrice: 85,
        genericPrice: 12,
        savings: '85%',
        description: 'Used to treat many conditions such as headache, muscle aches, and fever.',
    },
];

export function GenericComparisonScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filteredItems = COMPARISONS.filter(item =>
        item.branded.toLowerCase().includes(search.toLowerCase()) ||
        item.generic.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-6 py-4 flex-row items-center border-b border-background-tertiary">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Icon name="arrow-back" size={24} className="text-text-primary" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-2">Generic Savings</Text>
            </View>

            <View className="px-6 pt-6 mb-4">
                <Text className="text-text-primary text-2xl font-black mb-2">Switch to Generics</Text>
                <Text className="text-text-secondary mb-6">Compare branded medication prices with their generic equivalents and save up to 80%.</Text>

                <View className="bg-background-secondary p-4 rounded-2xl flex-row items-center border border-background-tertiary">
                    <Icon name="search" size={20} className="text-text-tertiary mr-3" />
                    <TextInput
                        placeholder="Search branded or generic drug..."
                        placeholderTextColor="#666"
                        className="flex-1 text-text-primary"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView className="px-6 flex-1">
                {filteredItems.map((item, index) => (
                    <Animated.View
                        key={item.branded}
                        entering={FadeInUp.delay(index * 100).duration(600)}
                        className="bg-background-secondary p-5 rounded-3xl mb-4 border border-background-tertiary"
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-1">
                                <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest">Branded Name</Text>
                                <Text className="text-text-primary text-lg font-bold">{item.branded}</Text>
                            </View>
                            <View className="bg-status-missed/10 px-3 py-1 rounded-full border border-status-missed/20">
                                <Text className="text-status-missed font-bold">₹{item.brandedPrice}</Text>
                            </View>
                        </View>

                        <View className="h-[1px] bg-background-tertiary mb-4" />

                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-1">
                                <Text className="text-primary text-xs font-bold uppercase tracking-widest">Generic Choice</Text>
                                <Text className="text-primary text-lg font-bold">{item.generic}</Text>
                            </View>
                            <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                <Text className="text-primary font-bold">₹{item.genericPrice}</Text>
                            </View>
                        </View>

                        <View className="bg-background-primary/50 p-3 rounded-xl flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                                <Text className="text-primary font-bold text-xs">{item.savings}</Text>
                            </View>
                            <Text className="text-text-secondary text-xs flex-1">Switching to the generic version can save you ₹{item.brandedPrice - item.genericPrice} per pack.</Text>
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
