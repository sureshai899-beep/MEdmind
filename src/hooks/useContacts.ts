import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contact {
    id: string;
    type: 'doctor' | 'pharmacy' | 'other';
    name: string;
    specialty?: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
    createdAt: string;
}

const STORAGE_KEY = '@pillara_contacts';

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const loadContacts = useCallback(async () => {
        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setContacts(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Error loading contacts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveContacts = async (newContacts: Contact[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
            setContacts(newContacts);
        } catch (err) {
            console.error('Error saving contacts:', err);
        }
    };

    const addContact = async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
        const newContact: Contact = {
            ...contact,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        const updated = [...contacts, newContact];
        await saveContacts(updated);
        return newContact;
    };

    const updateContact = async (id: string, updates: Partial<Contact>) => {
        const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c);
        await saveContacts(updated);
    };

    const deleteContact = async (id: string) => {
        const updated = contacts.filter(c => c.id !== id);
        await saveContacts(updated);
    };

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    return {
        contacts,
        loading,
        addContact,
        updateContact,
        deleteContact,
        refresh: loadContacts,
    };
}
