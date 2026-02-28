import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContacts, Contact } from '../../hooks/useContacts';
import { Icon } from '../../components/ui/Icon';

const ContactItem = ({ contact, onEdit, onDelete }: { contact: Contact; onEdit: () => void; onDelete: () => void }) => {
    const handleCall = () => {
        if (contact.phone) {
            Linking.openURL(`tel:${contact.phone}`);
        }
    };

    const handleEmail = () => {
        if (contact.email) {
            Linking.openURL(`mailto:${contact.email}`);
        }
    };

    return (
        <View className="bg-background-secondary p-4 rounded-2xl mb-3 flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Icon
                    name={contact.type === 'doctor' ? 'medical' : contact.type === 'pharmacy' ? 'cart' : 'person'}
                    size={24}
                    className="text-primary"
                />
            </View>
            <View className="flex-1">
                <Text className="text-text-primary font-bold text-lg">{contact.name}</Text>
                {contact.specialty && (
                    <Text className="text-text-secondary text-sm">{contact.specialty}</Text>
                )}
                <View className="flex-row mt-2 space-x-3">
                    <TouchableOpacity onPress={handleCall} className="bg-primary/20 p-2 rounded-lg">
                        <Icon name="call" size={16} className="text-primary" />
                    </TouchableOpacity>
                    {contact.email && (
                        <TouchableOpacity onPress={handleEmail} className="bg-primary/20 p-2 rounded-lg">
                            <Icon name="mail" size={16} className="text-primary" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View className="flex-row items-center">
                <TouchableOpacity onPress={onEdit} className="p-2">
                    <Icon name="create" size={20} className="text-text-secondary" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} className="p-2" testID="delete-contact">
                    <Icon name="trash" size={20} className="text-error" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const ContactDirectoryScreen = () => {
    const router = useRouter();
    const { contacts, loading, deleteContact } = useContacts();
    const [filter, setFilter] = useState<'all' | 'doctor' | 'pharmacy'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = contacts.filter(c => {
        const matchesFilter = filter === 'all' || c.type === filter;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.specialty?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Contact",
            "Are you sure you want to remove this contact?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteContact(id) }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={24} className="text-text-primary" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold">Directory</Text>
                <TouchableOpacity onPress={() => (router.push('/contacts/add' as any))}>
                    <Icon name="add" size={28} className="text-primary" />
                </TouchableOpacity>
            </View>

            <View className="px-6 mb-4">
                <View className="bg-background-secondary p-3 rounded-xl flex-row items-center">
                    <Icon name="search" size={20} className="text-text-tertiary mr-2" />
                    <Text className="text-text-tertiary flex-1">Search contacts...</Text>
                    {/* Simplified Search Placeholder */}
                </View>
            </View>

            <View className="px-6 flex-row mb-6 space-x-2">
                {['all', 'doctor', 'pharmacy'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setFilter(type as any)}
                        className={`px-4 py-2 rounded-full ${filter === type ? 'bg-primary' : 'bg-background-secondary'}`}
                    >
                        <Text className={`${filter === type ? 'text-white' : 'text-text-secondary'} capitalize`}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView className="px-6">
                {filteredContacts.length === 0 ? (
                    <View className="py-20 items-center">
                        <Icon name="people" size={64} className="text-text-quaternary mb-4" />
                        <Text className="text-text-secondary text-center">No contacts found</Text>
                    </View>
                ) : (
                    filteredContacts.map(contact => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            onEdit={() => (router.push(`/contacts/edit/${contact.id}` as any))}
                            onDelete={() => handleDelete(contact.id)}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
