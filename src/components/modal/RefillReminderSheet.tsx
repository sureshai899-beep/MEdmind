import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { cn } from "../../utils";
import { BottomSheet } from "./BottomSheet";
import { Icon } from "../ui/Icon";

export interface RefillReminderSheetProps {
    visible: boolean;
    onClose: () => void;
    medicationName: string;
    dosage: string;
    pillCount?: number;
    lowStockThreshold?: number;
    supplyRemaining: number; // Percentage
    daysLeft: number;
    onOrderPress: () => void;
    onDismiss: () => void;
    onUpdatePillCount?: (count: number) => void;
    onUpdateThreshold?: (threshold: number) => void;
    className?: string;
}

export const RefillReminderSheet: React.FC<RefillReminderSheetProps> = ({
    visible,
    onClose,
    medicationName,
    dosage,
    pillCount = 0,
    lowStockThreshold = 7,
    supplyRemaining,
    daysLeft,
    onOrderPress,
    onDismiss,
    onUpdatePillCount,
    onUpdateThreshold,
    className,
}) => {
    const [editingCount, setEditingCount] = React.useState(false);
    const [editingThreshold, setEditingThreshold] = React.useState(false);
    const [tempCount, setTempCount] = React.useState(pillCount.toString());
    const [tempThreshold, setTempThreshold] = React.useState(lowStockThreshold.toString());

    React.useEffect(() => {
        setTempCount(pillCount.toString());
        setTempThreshold(lowStockThreshold.toString());
    }, [pillCount, lowStockThreshold]);

    const handleSaveCount = () => {
        const count = parseInt(tempCount, 10);
        if (!isNaN(count) && count >= 0 && onUpdatePillCount) {
            onUpdatePillCount(count);
        }
        setEditingCount(false);
    };

    const handleSaveThreshold = () => {
        const threshold = parseInt(tempThreshold, 10);
        if (!isNaN(threshold) && threshold > 0 && onUpdateThreshold) {
            onUpdateThreshold(threshold);
        }
        setEditingThreshold(false);
    };
    return (
        <BottomSheet visible={visible} onClose={onClose} className={className}>
            <View className="items-center px-6 pb-12">
                <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-6">
                    <Text className="text-3xl">💊</Text>
                </View>

                <Text className="text-text-primary text-3xl font-bold text-center mb-2">
                    Refill Reminder
                </Text>
                <Text className="text-text-secondary text-lg text-center mb-8">
                    {medicationName} {dosage}
                </Text>

                <View className="w-full bg-background-primary rounded-2xl p-6 mb-10">
                    <Text className="text-text-primary text-base font-bold mb-4">
                        Supply Remaining
                    </Text>
                    <View className="w-full h-2 bg-ui-border rounded-full overflow-hidden mb-3">
                        <View
                            className={cn(
                                "h-full rounded-full",
                                supplyRemaining < 20 ? "bg-[#FF9F0A]" : "bg-primary"
                            )}
                            style={{ width: `${supplyRemaining}%` }}
                        />
                    </View>
                    <Text className="text-[#F6AD55] text-sm font-medium">
                        Only {daysLeft} days left
                    </Text>
                </View>

                {/* Pill Count Tracker */}
                <View className="w-full bg-background-primary rounded-2xl p-6 mb-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-text-primary text-base font-bold">
                            Pills Remaining
                        </Text>
                        {!editingCount && onUpdatePillCount && (
                            <TouchableOpacity onPress={() => setEditingCount(true)}>
                                <Icon name="edit" size={18} color="#10D9A5" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {editingCount ? (
                        <View className="flex-row items-center gap-2">
                            <TextInput
                                value={tempCount}
                                onChangeText={setTempCount}
                                keyboardType="number-pad"
                                className="flex-1 bg-background-secondary text-text-primary text-lg px-4 py-3 rounded-xl border border-ui-border"
                                placeholder="Enter count"
                                placeholderTextColor="#8A95A5"
                            />
                            <TouchableOpacity
                                onPress={handleSaveCount}
                                className="bg-primary px-4 py-3 rounded-xl"
                            >
                                <Icon name="checkmark" size={20} color="#0F1E1C" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempCount(pillCount.toString());
                                    setEditingCount(false);
                                }}
                                className="bg-background-secondary px-4 py-3 rounded-xl"
                            >
                                <Icon name="close" size={20} color="#A0AEC0" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex-row items-baseline gap-2">
                            <Text className="text-text-primary text-4xl font-bold">
                                {pillCount}
                            </Text>
                            <Text className="text-text-tertiary text-lg">pills</Text>
                        </View>
                    )}
                </View>

                {/* Low Stock Threshold */}
                {onUpdateThreshold && (
                    <View className="w-full bg-background-primary rounded-2xl p-6 mb-6">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-text-primary text-base font-bold">
                                Alert Threshold
                            </Text>
                            {!editingThreshold && (
                                <TouchableOpacity onPress={() => setEditingThreshold(true)}>
                                    <Icon name="edit" size={18} color="#10D9A5" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {editingThreshold ? (
                            <View className="flex-row items-center gap-2">
                                <TextInput
                                    value={tempThreshold}
                                    onChangeText={setTempThreshold}
                                    keyboardType="number-pad"
                                    className="flex-1 bg-background-secondary text-text-primary text-lg px-4 py-3 rounded-xl border border-ui-border"
                                    placeholder="Enter threshold"
                                    placeholderTextColor="#8A95A5"
                                />
                                <TouchableOpacity
                                    onPress={handleSaveThreshold}
                                    className="bg-primary px-4 py-3 rounded-xl"
                                >
                                    <Icon name="checkmark" size={20} color="#0F1E1C" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setTempThreshold(lowStockThreshold.toString());
                                        setEditingThreshold(false);
                                    }}
                                    className="bg-background-secondary px-4 py-3 rounded-xl"
                                >
                                    <Icon name="close" size={20} color="#A0AEC0" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text className="text-text-secondary text-base">
                                Alert me when {lowStockThreshold} or fewer pills remain
                            </Text>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    onPress={onOrderPress}
                    className="w-full bg-primary py-5 rounded-2xl items-center justify-center mb-6"
                >
                    <Text className="text-black text-lg font-bold">Order Refill</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDismiss}>
                    <Text className="text-text-tertiary text-lg font-bold">Dismiss</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};
