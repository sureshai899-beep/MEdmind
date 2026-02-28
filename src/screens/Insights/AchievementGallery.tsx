import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../../components/ui/Icon';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

const ACHIEVEMENTS = [
    {
        id: '1',
        title: 'Early Bird',
        description: 'Take your first 5 morning doses on time.',
        icon: 'time',
        color: '#F59E0B',
        unlocked: true,
        progress: 100,
    },
    {
        id: '2',
        title: 'Perfect Week',
        description: '100% adherence for 7 consecutive days.',
        icon: 'star',
        color: '#10D9A5',
        unlocked: true,
        progress: 100,
    },
    {
        id: '3',
        title: 'Health Warrior',
        description: 'Successfully log 50 total doses.',
        icon: 'shield-checkmark',
        color: '#3B82F6',
        unlocked: false,
        progress: 65,
    },
    {
        id: '4',
        title: 'Streak Master',
        description: 'Maintain a 30-day taking streak.',
        icon: 'flash',
        color: '#8B5CF6',
        unlocked: false,
        progress: 20,
    },
];

export function AchievementGallery() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-6 py-4 flex-row items-center border-b border-background-tertiary">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Icon name="arrow-back" size={24} className="text-text-primary" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-2">Achievements</Text>
            </View>

            <ScrollView className="px-6 flex-1 pt-6">
                <View className="flex-row items-center bg-background-secondary p-6 rounded-3xl mb-8 border border-primary/20">
                    <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mr-6">
                        <Icon name="star" size={32} color="#10D9A5" />
                    </View>
                    <View>
                        <Text className="text-text-primary text-2xl font-black">Level 4</Text>
                        <Text className="text-text-secondary">240 XP to Level 5</Text>
                    </View>
                </View>

                <View className="flex-row flex-wrap justify-between">
                    {ACHIEVEMENTS.map((achievement, index) => (
                        <Animated.View
                            key={achievement.id}
                            entering={FadeInUp.delay(index * 100).duration(600)}
                            style={{ width: '48%' }}
                            className="bg-background-secondary p-5 rounded-3xl mb-4 border border-background-tertiary items-center"
                        >
                            <Animated.View
                                entering={achievement.unlocked ? ZoomIn.delay(500) : undefined}
                                style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : '#2D3748' }}
                                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                            >
                                <Icon
                                    name={achievement.icon as any}
                                    size={30}
                                    color={achievement.unlocked ? achievement.color : '#4A5568'}
                                />
                            </Animated.View>
                            <Text className={`text-center font-bold mb-1 ${achievement.unlocked ? 'text-text-primary' : 'text-text-tertiary'}`}>
                                {achievement.title}
                            </Text>
                            <Text className="text-center text-text-secondary text-[10px] leading-3 mb-4">
                                {achievement.description}
                            </Text>

                            <View className="w-full h-1 bg-background-tertiary rounded-full overflow-hidden">
                                <View
                                    style={{ width: `${achievement.progress}%`, backgroundColor: achievement.color }}
                                    className="h-full"
                                />
                            </View>
                            <Text className="text-text-tertiary text-[9px] mt-1">{achievement.progress}% Complete</Text>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
