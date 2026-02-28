import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../constants/Colors';
import { BottomTabBar } from '../../components';
import { useProtectedRoute } from '../../utils/protectedRoute';

export default function TabLayout() {
    // Protect all tab routes - redirect to login if not authenticated
    useProtectedRoute();

    return (
        <Tabs
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary.DEFAULT,
                tabBarInactiveTintColor: colors.text.tertiary,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="medications"
                options={{
                    title: 'Meds',
                }}
            />
            <Tabs.Screen
                name="logs"
                options={{
                    title: 'Logs',
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
