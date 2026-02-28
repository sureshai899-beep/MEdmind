import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/Colors';
import { Icon } from '../ui/Icon';

interface ProfileSetupFormProps {
    onComplete: (data: {
        name: string;
        age?: number;
        profilePictureUrl?: string;
        weight?: number;
        weightUnit?: 'kg' | 'lbs';
        allergies?: string[];
        chronicConditions?: string[];
        language?: string;
    }) => void;
}

export function ProfileSetupForm({ onComplete }: ProfileSetupFormProps) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [profilePictureUrl, setAvatarUri] = useState<string | undefined>(undefined);
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
    const [allergyInput, setAllergyInput] = useState('');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [chronicConditions, setChronicConditions] = useState<string[]>([]);
    const [language, setLanguage] = useState('English');

    const INDIAN_LANGUAGES = [
        'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu',
        'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Malayalam', 'Punjabi'
    ];

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'We need camera roll permissions to set a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const addAllergy = () => {
        if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
            setAllergies([...allergies, allergyInput.trim()]);
            setAllergyInput('');
        }
    };

    const removeAllergy = (allergy: string) => {
        setAllergies(allergies.filter(a => a !== allergy));
    };

    const toggleCondition = (condition: string) => {
        if (chronicConditions.includes(condition)) {
            setChronicConditions(chronicConditions.filter(c => c !== condition));
        } else {
            setChronicConditions([...chronicConditions, condition]);
        }
    };

    const commonConditions = [
        'Diabetes',
        'Hypertension',
        'Asthma',
        'Heart Disease',
        'Arthritis',
        'Thyroid Disorder',
    ];

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter your name.');
            return;
        }

        onComplete({
            name: name.trim(),
            age: age ? parseInt(age, 10) : undefined,
            profilePictureUrl: profilePictureUrl,
            weight: weight ? parseFloat(weight) : undefined,
            weightUnit: weightUnit,
            allergies: allergies.length > 0 ? allergies : undefined,
            chronicConditions: chronicConditions.length > 0 ? chronicConditions : undefined,
            language: language,
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>This helps us personalize your experience.</Text>

            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                {profilePictureUrl ? (
                    <Image source={{ uri: profilePictureUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Icon name="camera" size={32} color="#10D9A5" />
                    </View>
                )}
                <View style={styles.addIcon}>
                    <Icon name="add" size={16} color="#0F1E1C" />
                </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <Icon name="person" size={20} color="#10D9A5" />
                    <TextInput
                        style={styles.input}
                        placeholder="John Doe"
                        placeholderTextColor="#8A95A5"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Age (Optional)</Text>
                <View style={styles.inputContainer}>
                    <Icon name="calendar" size={20} color="#10D9A5" />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 25"
                        placeholderTextColor="#8A95A5"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="number-pad"
                    />
                </View>
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight (Optional)</Text>
                <View style={styles.inputContainer}>
                    <Icon name="medical" size={20} color="#10D9A5" />
                    <TextInput
                        style={[styles.input, { flex: 2 }]}
                        placeholder="e.g. 70"
                        placeholderTextColor="#8A95A5"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="decimal-pad"
                    />
                    <View style={styles.unitSelector}>
                        <TouchableOpacity
                            onPress={() => setWeightUnit('kg')}
                            style={[
                                styles.unitButton,
                                weightUnit === 'kg' && styles.unitButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.unitText,
                                weightUnit === 'kg' && styles.unitTextActive
                            ]}>kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setWeightUnit('lbs')}
                            style={[
                                styles.unitButton,
                                weightUnit === 'lbs' && styles.unitButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.unitText,
                                weightUnit === 'lbs' && styles.unitTextActive
                            ]}>lbs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Allergies Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Allergies (Optional)</Text>
                <View style={styles.inputContainer}>
                    <Icon name="warning" size={20} color="#10D9A5" />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Penicillin"
                        placeholderTextColor="#8A95A5"
                        value={allergyInput}
                        onChangeText={setAllergyInput}
                        onSubmitEditing={addAllergy}
                        returnKeyType="done"
                    />
                    <TouchableOpacity onPress={addAllergy} style={styles.addButton}>
                        <Icon name="add" size={20} color="#10D9A5" />
                    </TouchableOpacity>
                </View>
                {allergies.length > 0 && (
                    <View style={styles.tagContainer}>
                        {allergies.map((allergy, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{allergy}</Text>
                                <TouchableOpacity onPress={() => removeAllergy(allergy)}>
                                    <Icon name="close" size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Chronic Conditions */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Chronic Conditions (Optional)</Text>
                <View style={styles.conditionsGrid}>
                    {commonConditions.map((condition) => (
                        <TouchableOpacity
                            key={condition}
                            onPress={() => toggleCondition(condition)}
                            style={[
                                styles.conditionChip,
                                chronicConditions.includes(condition) && styles.conditionChipActive
                            ]}
                        >
                            <Text style={[
                                styles.conditionText,
                                chronicConditions.includes(condition) && styles.conditionTextActive
                            ]}>
                                {condition}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Language Selection */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary App Language</Text>
                <View style={styles.conditionsGrid}>
                    {INDIAN_LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang}
                            onPress={() => setLanguage(lang)}
                            style={[
                                styles.conditionChip,
                                language === lang && styles.conditionChipActive
                            ]}
                        >
                            <Text style={[
                                styles.conditionText,
                                language === lang && styles.conditionTextActive
                            ]}>
                                {lang}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={handleSave}
                style={[
                    styles.button,
                    !name.trim() && styles.buttonDisabled
                ]}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Save & Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    contentContainer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#A0AEC0',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 32,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A2E2A',
        borderWidth: 1,
        borderColor: '#2D3748',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#10D9A5',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#0F1E1C',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    inputContainer: {
        backgroundColor: '#1A2E2A',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginLeft: 15,
        color: '#FFFFFF',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#10D9A5',
        height: 60,
        width: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    buttonDisabled: {
        backgroundColor: '#2D3748',
        opacity: 0.5,
    },
    buttonText: {
        color: '#0F1E1C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    unitSelector: {
        flexDirection: 'row',
        marginLeft: 10,
        gap: 8,
    },
    unitButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#2D3748',
    },
    unitButtonActive: {
        backgroundColor: '#10D9A5',
    },
    unitText: {
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: 'bold',
    },
    unitTextActive: {
        color: '#0F1E1C',
    },
    addButton: {
        padding: 4,
        marginLeft: 8,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10D9A5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    tagText: {
        color: '#0F1E1C',
        fontSize: 14,
        fontWeight: '600',
    },
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conditionChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: '#1A2E2A',
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    conditionChipActive: {
        backgroundColor: 'rgba(16, 217, 165, 0.2)',
        borderColor: '#10D9A5',
    },
    conditionText: {
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: '600',
    },
    conditionTextActive: {
        color: '#10D9A5',
    },
});
