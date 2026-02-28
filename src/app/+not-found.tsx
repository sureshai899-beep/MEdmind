import { Link, Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <SafeAreaView className="flex-1 bg-background-primary justify-center items-center p-6">
                <View className="w-24 h-24 bg-background-secondary rounded-full items-center justify-center mb-6">
                    <Text className="text-4xl">🔭</Text>
                </View>
                <Text className="text-text-primary text-2xl font-bold mb-2">Page Not Found</Text>
                <Text className="text-text-secondary text-center mb-8 leading-6">
                    The screen you are looking for doesn't exist or has been moved.
                </Text>

                <Link href="/(tabs)" asChild>
                    <TouchableOpacity className="bg-primary px-8 py-4 rounded-xl">
                        <Text className="text-text-primary font-bold text-lg">Go to Dashboard</Text>
                    </TouchableOpacity>
                </Link>
            </SafeAreaView>
        </>
    );
}
