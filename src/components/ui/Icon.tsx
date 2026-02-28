import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type IconName =
    | 'pill'
    | 'home'
    | 'person'
    | 'calendar'
    | 'notifications'
    | 'add'
    | 'edit'
    | 'trash'
    | 'camera'
    | 'search'
    | 'checkmark'
    | 'close'
    | 'arrow-back'
    | 'arrow-forward'
    | 'warning'
    | 'info'
    | 'stats'
    | 'phone'
    | 'menu'
    | 'settings'
    | 'help'
    | 'logout'
    | 'mail'
    | 'lock'
    | 'eye'
    | 'eye-off'
    | 'time'
    | 'refresh'
    | 'checkmark-circle'
    | 'close-circle'
    | 'logo-google'
    | 'medical'
    | 'people'
    | 'color-palette'
    | 'flash'
    | 'flash-off'
    | 'star'
    | 'images'
    | 'shield-checkmark'
    | 'cloud-upload'
    | 'scan'
    | 'image'
    | 'happy'
    | 'sad'
    | 'cart'
    | 'call'
    | 'create'
    | 'share'
    | 'chevron-forward'
    | 'sparkles'
    | 'logo-apple'
    | 'watch'
    | 'finger-print'
    | 'document-text'
    | 'heart'
    | 'chatbox'
    | 'list';

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    style?: ViewStyle;
    className?: string;
}

const iconMap: Record<IconName, keyof typeof Ionicons.glyphMap> = {
    'pill': 'medkit',
    'home': 'home',
    'person': 'person',
    'calendar': 'calendar',
    'notifications': 'notifications',
    'add': 'add',
    'edit': 'create',
    'trash': 'trash',
    'camera': 'camera',
    'search': 'search',
    'checkmark': 'checkmark',
    'close': 'close',
    'arrow-back': 'arrow-back',
    'arrow-forward': 'arrow-forward',
    'warning': 'warning',
    'info': 'information-circle',
    'stats': 'stats-chart',
    'phone': 'call',
    'menu': 'menu',
    'settings': 'settings',
    'help': 'help-circle',
    'logout': 'log-out',
    'mail': 'mail',
    'lock': 'lock-closed',
    'eye': 'eye',
    'eye-off': 'eye-off',
    'time': 'time',
    'refresh': 'refresh',
    'checkmark-circle': 'checkmark-circle',
    'close-circle': 'close-circle',
    'logo-google': 'logo-google',
    'medical': 'medkit',
    'people': 'people',
    'color-palette': 'color-palette',
    'flash': 'flash',
    'flash-off': 'flash-off',
    'star': 'star',
    'images': 'images-outline',
    'shield-checkmark': 'shield-checkmark',
    'cloud-upload': 'cloud-upload',
    'scan': 'scan',
    'image': 'image',
    'happy': 'happy-outline',
    'sad': 'sad-outline',
    'cart': 'cart',
    'call': 'call',
    'create': 'create',
    'share': 'share-outline',
    'chevron-forward': 'chevron-forward',
    'sparkles': 'sparkles',
    'logo-apple': 'logo-apple',
    'watch': 'watch',
    'finger-print': 'finger-print',
    'document-text': 'document-text',
    'heart': 'heart',
    'chatbox': 'chatbubbles-outline',
    'list': 'list',
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style, className }) => {
    const ionIconName = iconMap[name];

    if (!ionIconName) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return (
        <View
            className={className}
            style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}
        >
            <Ionicons name={ionIconName} size={size} color={color} />
        </View>
    );
};
