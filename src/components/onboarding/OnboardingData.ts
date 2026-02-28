import { IconName } from "../ui/Icon";
import { colors } from "../../constants/Colors";

export interface OnboardingSlideData {
    id: string;
    title: string;
    description: string;
    icon: IconName;
    color: string;
    isValueProp?: boolean;
    isConsent?: boolean;
    isMultiPerm?: boolean;
    isPrivacy?: boolean;
    isProfile?: boolean;
}

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
    {
        id: 'ocr',
        title: "Smart OCR Scanning",
        description: "Just point your camera at any pill bottle. Our AI instantly extracts names, dosages, and complex schedules with 99% accuracy.",
        icon: 'camera',
        color: colors.primary.DEFAULT,
        isValueProp: true
    },
    {
        id: 'safety',
        title: "Safety First",
        description: "Advanced interaction checks cross-reference your entire medicine cabinet against food, alcohol, and other drugs in real-time.",
        icon: 'shield-checkmark',
        color: colors.primary.DEFAULT,
        isValueProp: true
    },
    {
        id: 'family',
        title: "Circle of Trust",
        description: "Connect with parents, children, or caregivers. Get notified instantly if a loved one misses a critical dose.",
        icon: 'people',
        color: colors.primary.DEFAULT,
        isValueProp: true
    },
    {
        id: 'consent',
        title: "Your Data, Secured",
        description: "We store your medical information locally to help you track doses and check for interactions. Your privacy is our priority.",
        icon: 'lock',
        color: colors.primary.DEFAULT,
        isConsent: true
    },
    {
        id: 'permissions',
        title: "Enable Permissions",
        description: "To provide the best experience, Pillara needs access to your Camera, Notifications, and Media Library.",
        icon: 'settings',
        color: colors.primary.DEFAULT,
        isMultiPerm: true
    },
    {
        id: 'privacy_perm',
        title: "Secure Access",
        description: "Enable biometric lock to keep your sensitive medical data private and secure.",
        icon: 'finger-print',
        color: colors.primary.DEFAULT,
        isPrivacy: true
    },
    {
        id: 'profile',
        title: "Finalize Profile",
        description: "Tell us about yourself so we can personalize your health experience.",
        icon: 'person',
        color: colors.primary.DEFAULT,
        isProfile: true
    }
];
