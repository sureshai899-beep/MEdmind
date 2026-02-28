import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../services/apiClient';
import { colors } from '../../constants/Colors';
import { Icon } from '../../components/ui/Icon';

export default function CommunityScreen() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: () => API.posts.list(),
    });

    const posts = data?.data?.posts || [];

    const renderPost = ({ item }: { item: any }) => (
        <View className="bg-background-secondary p-4 rounded-3xl mb-4 border border-[#233532]">
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                    <Icon name="person" size={20} color={colors.primary.DEFAULT} />
                </View>
                <View>
                    <Text className="text-text-primary font-bold">{item.user?.name || 'User'}</Text>
                    <Text className="text-text-tertiary text-xs">{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>

            <Text className="text-text-primary font-bold text-lg mb-2">{item.title}</Text>
            <Text className="text-text-secondary mb-3 leading-5">{item.content}</Text>

            {item.imageUrl && (
                <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-48 rounded-2xl mb-3"
                    resizeMode="cover"
                />
            )}

            <View className="flex-row border-t border-[#233532] pt-3 mt-1">
                <TouchableOpacity className="flex-row items-center mr-6">
                    <Icon name="heart" size={18} color={colors.text.tertiary} />
                    <Text className="text-text-tertiary ml-2">Like</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                    <Icon name="chatbox" size={18} color={colors.text.tertiary} />
                    <Text className="text-text-tertiary ml-2">Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-background-primary pt-12 px-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text-primary text-3xl font-bold">Community</Text>
                <TouchableOpacity className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                    <Icon name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-text-tertiary">Loading posts...</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isLoading}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center pt-20">
                            <Icon name="people" size={64} color={colors.text.tertiary} />
                            <Text className="text-text-secondary text-lg mt-4 font-bold">No posts yet</Text>
                            <Text className="text-text-tertiary text-center mt-2 px-10">
                                Be the first to share your journey with the community!
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
