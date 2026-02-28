import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Icon } from '../ui/Icon';

export interface Profile {
    id: string;
    name: string;
    role: 'self' | 'dependent' | 'caregiver';
    profilePictureUrl: string;
}

interface ProfileSwitcherSheetProps {
    profiles: Profile[];
    currentProfileId: string;
    onSelect: (profile: Profile) => void;
    onClose: () => void;
}

export const ProfileSwitcherSheet: React.FC<ProfileSwitcherSheetProps> = ({
    profiles,
    currentProfileId,
    onSelect,
    onClose,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.indicator} />
            <Text style={styles.title}>Switch Profile</Text>

            <View style={styles.profileList}>
                {profiles.map((profile) => (
                    <TouchableOpacity
                        key={profile.id}
                        onPress={() => onSelect(profile)}
                        style={[
                            styles.profileItem,
                            currentProfileId === profile.id && styles.activeItem
                        ]}
                    >
                        <Image source={{ uri: profile.profilePictureUrl }} style={styles.avatar} />
                        <View style={styles.profileInfo}>
                            <Text style={[
                                styles.profileName,
                                currentProfileId === profile.id && styles.activeText
                            ]}>
                                {profile.name}
                            </Text>
                            <Text style={styles.profileRole}>
                                {profile.role === 'self' ? 'Primary Account' : 'Dependent'}
                            </Text>
                        </View>
                        {currentProfileId === profile.id && (
                            <Icon name="checkmark-circle" size={24} color="#10D9A5" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.addButton}>
                <Icon name="add" size={24} color="#10D9A5" />
                <Text style={styles.addButtonText}>Add New Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0F1E1C',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#2D3748',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    profileList: {
        marginBottom: 16,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#1A2E2A',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeItem: {
        borderColor: '#10D9A5',
        backgroundColor: 'rgba(16, 217, 165, 0.1)',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    activeText: {
        color: '#10D9A5',
    },
    profileRole: {
        fontSize: 12,
        color: '#718096',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
        borderStyle: 'dashed',
        borderRadius: 16,
        marginBottom: 24,
        gap: 8,
    },
    addButtonText: {
        color: '#10D9A5',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#A0AEC0',
        fontSize: 16,
    },
});
