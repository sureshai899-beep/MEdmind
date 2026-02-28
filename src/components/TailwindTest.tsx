import React from "react";
import { View, Text } from "react-native";

export const TailwindTest = () => {
    return (
        <View className="p-4 bg-red-500 rounded-lg mt-4">
            <Text className="text-text-primary font-bold text-center">
                Tailwind is working!
            </Text>
        </View>
    );
};
