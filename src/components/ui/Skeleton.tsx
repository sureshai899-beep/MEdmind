import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import { cn } from "../../utils";

export interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    variant?: "rectangle" | "circle" | "text";
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = "100%",
    height = 20,
    variant = "rectangle",
    className,
}) => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmer.value,
            [0, 1],
            [-300, 300]
        );

        return {
            transform: [{ translateX }],
        };
    });

    const getVariantStyles = () => {
        switch (variant) {
            case "circle":
                return "rounded-full";
            case "text":
                return "rounded-md";
            case "rectangle":
            default:
                return "rounded-lg";
        }
    };

    const containerStyle: ViewStyle = {
        width: typeof width === "number" ? width : width,
        height: typeof height === "number" ? height : height,
    };

    return (
        <View
            className={cn(
                "bg-background-secondary overflow-hidden",
                getVariantStyles(),
                className
            )}
            style={containerStyle}
        >
            <Animated.View
                className="h-full w-full bg-gradient-to-r from-transparent via-background-tertiary to-transparent"
                style={[
                    {
                        width: "100%",
                        height: "100%",
                        opacity: 0.3,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
};

// Preset skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className,
}) => {
    return (
        <View className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    variant="text"
                    height={16}
                    width={index === lines - 1 ? "60%" : "100%"}
                />
            ))}
        </View>
    );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <View className={cn("bg-background-secondary p-md rounded-xl", className)}>
            <View className="flex-row items-center mb-md">
                <Skeleton variant="circle" width={48} height={48} className="mr-md" />
                <View className="flex-1">
                    <Skeleton variant="text" height={16} width="60%" className="mb-xs" />
                    <Skeleton variant="text" height={12} width="40%" />
                </View>
            </View>
            <SkeletonText lines={2} />
        </View>
    );
};

export const SkeletonMedicationCard: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <View className={cn("bg-background-secondary p-lg rounded-xl border border-ui-border", className)}>
            <View className="flex-row items-center justify-between mb-md">
                <View className="flex-row items-center flex-1">
                    <Skeleton variant="circle" width={40} height={40} className="mr-md" />
                    <View className="flex-1">
                        <Skeleton variant="text" height={18} width="70%" className="mb-xs" />
                        <Skeleton variant="text" height={14} width="50%" />
                    </View>
                </View>
            </View>
            <View className="flex-row justify-between mt-md">
                <Skeleton variant="rectangle" width={100} height={36} />
                <Skeleton variant="rectangle" width={100} height={36} />
            </View>
        </View>
    );
};
