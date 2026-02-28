import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils";
import { Button } from "../ui/Button";

export interface OfflineStateProps {
    onRetry?: () => void;
    onHelp?: () => void;
    className?: string;
}

export const OfflineState: React.FC<OfflineStateProps> = ({
    onRetry,
    onHelp,
    className,
}) => {
    return (
        <View
            className={cn(
                "flex-1 bg-background-primary items-center justify-center px-10",
                className
            )}
        >
            <Text className="text-primary text-8xl mb-8 font-light">cloud_off</Text>

            <Text className="text-text-primary text-2xl font-bold text-center mb-3">
                No Internet Connection
            </Text>

            <Text className="text-text-secondary text-base text-center mb-10 leading-6">
                We can't seem to connect to our servers right now. Please check your Wi-Fi or cellular data and try again.
            </Text>

            <Button
                variant="primary"
                size="lg"
                onPress={onRetry}
                className="w-full mb-8"
            >
                Retry
            </Button>

            {onHelp && (
                <TouchableOpacity onPress={onHelp}>
                    <Text className="text-primary text-sm font-semibold underline">
                        Need help?
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
