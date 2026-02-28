import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MedicationListItem, SearchBar, FilterChip, FloatingActionButton, EmptyState } from '../../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useMedications, Medication } from '../../../hooks/useMedications';

export function MedicationsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeFilter, setActiveFilter] = React.useState("All");

    // Use custom hook
    const { medications, loading, searchMedications, filterByStatus } = useMedications();

    // Apply search and filter
    const filteredMeds = React.useMemo(() => {
        let results = medications;

        // Apply status filter
        if (activeFilter !== "All") {
            results = filterByStatus(activeFilter as Medication['status']);
        }

        // Apply search
        if (searchQuery) {
            results = results.filter(med =>
                med.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return results;
    }, [medications, searchQuery, activeFilter, filterByStatus]);

    const renderMedItem = ({ item, index }: { item: Medication, index: number }) => (
        <Animated.View entering={FadeInUp.delay(300 + index * 100).duration(600)}>
            <Link href={`/medication/${item.id}`} asChild>
                <TouchableOpacity>
                    <MedicationListItem
                        name={item.name}
                        dosage={item.dosage}
                        schedule={item.schedule}
                        nextDose={item.nextDose || "Not scheduled"}
                        nextDoseTime={item.nextDoseTime || ""}
                        icon={item.icon || "💊"}
                        iconBg={item.iconBg || "#1E7A6D"}
                    />
                </TouchableOpacity>
            </Link>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-primary" edges={['top', 'left', 'right']}>
            <View className="px-4 py-4 flex-1">
                <Animated.Text
                    entering={FadeInDown.duration(600)}
                    className="text-text-primary text-h2 mb-4"
                >
                    My Medications
                </Animated.Text>

                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <SearchBar
                        placeholder="Search your meds..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="mb-4"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <FlatList
                        data={["All", "Active", "Completed", "Paused"]}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        className="mb-6 max-h-12"
                        renderItem={({ item }) => (
                            <FilterChip
                                label={item}
                                active={activeFilter === item}
                                onPress={() => setActiveFilter(item)}
                                className="mr-2"
                            />
                        )}
                    />
                </Animated.View>

                {loading ? (
                    <Animated.View
                        entering={FadeInUp.delay(300).duration(600)}
                        className="flex-1 justify-center items-center"
                    >
                        <Text className="text-text-primary text-lg">Loading medications...</Text>
                    </Animated.View>
                ) : (
                    <FlatList
                        data={filteredMeds}
                        renderItem={renderMedItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                        ListEmptyComponent={
                            <Animated.View entering={FadeInUp.delay(300).duration(600)}>
                                <EmptyState
                                    icon="🔍"
                                    title="No Medications Found"
                                    description={searchQuery ? `We couldn't find any meds matching "${searchQuery}"` : "You haven't added any medications yet."}
                                    actionLabel="Add Medication"
                                    onAction={() => router.push('/scan')}
                                />
                            </Animated.View>
                        }
                        ListFooterComponent={<View className="h-40" />}
                    />
                )}
            </View>

            <Animated.View entering={FadeInDown.delay(800).springify()}>
                <FloatingActionButton
                    icon="+"
                    label="Scan Med"
                    onPress={() => router.push('/scan')}
                />
            </Animated.View>
        </SafeAreaView>
    );
}
