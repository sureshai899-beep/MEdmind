import { renderHook, act } from '@testing-library/react-native';
import { useCamera } from '../useCamera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

// Mock expo-camera
jest.mock('expo-camera', () => ({
    useCameraPermissions: jest.fn(),
    useMicrophonePermissions: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
    },
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
    getInfoAsync: jest.fn(),
}));

describe('useCamera hook', () => {
    const mockRequestPermission = jest.fn();
    const mockRequestMicPermission = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useCameraPermissions as jest.Mock).mockReturnValue([{ granted: false }, mockRequestPermission]);
        (useMicrophonePermissions as jest.Mock).mockReturnValue([{ granted: false }, mockRequestMicPermission]);
    });

    it('requests camera permission', async () => {
        mockRequestPermission.mockResolvedValue({ granted: true });
        const { result } = renderHook(() => useCamera());

        let granted;
        await act(async () => {
            granted = await result.current.requestPermission();
        });

        expect(mockRequestPermission).toHaveBeenCalled();
        expect(granted).toBe(true);
    });

    it('requests media library permission', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        const { result } = renderHook(() => useCamera());

        let granted;
        await act(async () => {
            granted = await result.current.requestMediaLibraryPermission();
        });

        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(granted).toBe(true);
    });

    it('picks an image from library', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'mock-uri', width: 100, height: 100 }],
        });

        const { result } = renderHook(() => useCamera());

        let pickedImage;
        await act(async () => {
            pickedImage = await result.current.pickImage();
        });

        expect(pickedImage).toEqual({ uri: 'mock-uri', width: 100, height: 100 });
        expect(result.current.loading).toBe(false);
    });

    it('handles image picker cancellation', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: true,
            assets: null,
        });

        const { result } = renderHook(() => useCamera());

        let pickedImage;
        await act(async () => {
            pickedImage = await result.current.pickImage();
        });

        expect(pickedImage).toBeNull();
    });

    it('handles image picker errors', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockRejectedValue(new Error('Picker Error'));

        const { result } = renderHook(() => useCamera());

        let pickedImage;
        await act(async () => {
            pickedImage = await result.current.pickImage();
        });

        expect(pickedImage).toBeNull();
        expect(result.current.error).toBe('Failed to pick image');
    });

    it('gets image info', async () => {
        const mockInfo = { exists: true, size: 1000 };
        (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue(mockInfo);

        const { result } = renderHook(() => useCamera());

        let info;
        await act(async () => {
            info = await result.current.getImageInfo('some-uri');
        });

        expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('some-uri');
        expect(info).toEqual(mockInfo);
    });
});
