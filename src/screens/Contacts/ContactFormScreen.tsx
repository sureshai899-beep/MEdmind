import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useContacts, Contact } from '../../hooks/useContacts';
import { Icon } from '../../components/ui/Icon';

export const ContactFormScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { contacts, addContact, updateContact } = useContacts();

    const [type, setType] = useState<'doctor' | 'pharmacy' | 'other'>('doctor');
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (id && typeof id === 'string') {
            const contact = contacts.find(c => c.id === id);
            if (contact) {
                setType(contact.type);
                setName(contact.name);
                setSpecialty(contact.specialty || '');
                setPhone(contact.phone);
                setEmail(contact.email || '');
                setAddress(contact.address || '');
                setNotes(contact.notes || '');
            }
        }
    }, [id, contacts]);

    const handleSave = async () => {
        if (!name || !phone) {
            Alert.alert("Missing Info", "Please provide at least a name and phone number.");
            return;
        }

        try {
            if (id && typeof id === 'string') {
                await updateContact(id, { type, name, specialty, phone, email, address, notes });
            } else {
                await addContact({ type, name, specialty, phone, email, address, notes });
            }
            router.back();
        } catch (err) {
            Alert.alert("Error", "Could not save contact.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="px-6 py-4 flex-row items-center border-b border-background-tertiary">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="close" size={24} className="text-text-primary" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold ml-4">
                    {id ? 'Edit Contact' : 'New Contact'}
                </Text>
            </View>

            <ScrollView className="p-6">
                <Text className="text-text-secondary font-bold mb-2">CONTACT TYPE</Text>
                <View className="flex-row space-x-3 mb-6">
                    {(['doctor', 'pharmacy', 'other'] as const).map((t) => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setType(t)}
                            className={`flex-1 py-3 items-center rounded-xl border ${type === t ? 'border-primary bg-primary/10' : 'border-background-tertiary bg-background-secondary'}`}
                        >
                            <Text className={`${type === t ? 'text-primary font-bold' : 'text-text-secondary'} capitalize`}>
                                {t}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-text-secondary text-sm mb-1 ml-1">Full Name</Text>
                        <TextInput
                            className="bg-background-secondary p-4 rounded-xl text-text-primary"
                            placeholder="e.g. Dr. Sarah Smith"
                            placeholderTextColor="#666"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {type === 'doctor' && (
                        <View>
                            <Text className="text-text-secondary text-sm mb-1 ml-1">Specialty</Text>
                            <TextInput
                                className="bg-background-secondary p-4 rounded-xl text-text-primary"
                                placeholder="e.g. Cardiologist"
                                placeholderTextColor="#666"
                                value={specialty}
                                onChangeText={setSpecialty}
                            />
                        </View>
                    )}

                    <View>
                        <Text className="text-text-secondary text-sm mb-1 ml-1">Phone Number</Text>
                        <TextInput
                            className="bg-background-secondary p-4 rounded-xl text-text-primary"
                            placeholder="+1 234 567 890"
                            placeholderTextColor="#666"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <View>
                        <Text className="text-text-secondary text-sm mb-1 ml-1">Email Address</Text>
                        <TextInput
                            className="bg-background-secondary p-4 rounded-xl text-text-primary"
                            placeholder="doctor@clinic.com"
                            placeholderTextColor="#666"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View>
                        <Text className="text-text-secondary text-sm mb-1 ml-1">Office Address</Text>
                        <TextInput
                            className="bg-background-secondary p-4 rounded-xl text-text-primary"
                            placeholder="Full address"
                            placeholderTextColor="#666"
                            multiline
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    <View>
                        <Text className="text-text-secondary text-sm mb-1 ml-1">Notes</Text>
                        <TextInput
                            className="bg-background-secondary p-4 rounded-xl text-text-primary min-h-[100px]"
                            placeholder="Any additional info..."
                            placeholderTextColor="#666"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-primary p-4 rounded-2xl items-center mt-10 mb-20"
                >
                    <Text className="text-white font-bold text-lg">Save Contact</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};
