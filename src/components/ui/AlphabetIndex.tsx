import React from "react";
import { View, Text } from "react-native";
import { cn } from "../../utils";

export interface AlphabetIndexProps {
    letters: string[];
    className?: string;
}

export const AlphabetIndex: React.FC<AlphabetIndexProps> = ({
    letters,
    className,
}) => {
    return (
        <View className={cn("absolute right-2 top-0 bottom-0 justify-center", className)}>
            {letters.map((letter, index) => (
                <Text
                    key={index}
                    className="text-primary text-xs font-bold py-0.5"
                >
                    {letter}
                </Text>
            ))}
        </View>
    );
};
