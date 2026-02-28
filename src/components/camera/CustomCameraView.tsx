import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Dimensions,
    Alert,
    ActivityIndicator,
    Linking
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Icon } from '../ui/Icon';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScanOverlay } from '../scan/ScanOverlay';

const SCREEN_WIDTH = Dimensions.get('window').width;

export type CameraMode = 'picture' | 'video';
export type VideoStyle = 'default' | 'cinematic' | 'vibrant' | 'monochrome';

interface CustomCameraViewProps {
    visible: boolean;
    onClose: () => void;
    onCapture: (file: { uri: string; type: 'image' | 'video' }) => void;
}

export function CustomCameraView({ visible, onClose, onCapture }: CustomCameraViewProps) {
    const [mode, setMode] = useState<CameraMode>('picture');
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [micPermission, requestMicPermission] = useMicrophonePermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [videoStyle, setVideoStyle] = useState<VideoStyle>('default');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [zoom, setZoom] = useState(0);
    const cameraRef = useRef<CameraView>(null);

    // Animation values
    const shutterScale = useSharedValue(1);
    const styleOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            console.log('CustomCameraView mounted, visible=true');
            if (permission && !permission.granted) {
                console.log('Camera permission missing, requesting...');
                requestPermission();
            }
        }
    }, [visible, permission]);

    const handleCapture = async () => {
        if (!cameraRef.current) {
            console.warn('Camera ref not ready');
            return;
        }

        if (mode === 'picture') {
            try {
                shutterScale.value = withSpring(0.8, {}, () => {
                    shutterScale.value = withSpring(1);
                });
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    onCapture({ uri: photo.uri, type: 'image' });
                }
            } catch (e) {
                console.error('Capture error:', e);
                Alert.alert("Error", "Failed to take picture");
            }
        } else {
            if (isRecording) {
                setIsRecording(false);
                cameraRef.current.stopRecording();
            } else {
                if (!micPermission?.granted) {
                    const res = await requestMicPermission();
                    if (!res.granted) {
                        Alert.alert("Microphone Required", "Video recording requires microphone access.");
                        return;
                    }
                }

                setIsRecording(true);
                try {
                    const video = await cameraRef.current.recordAsync({
                        maxDuration: 60,
                    });
                    setIsRecording(false);
                    if (video) {
                        // Save to device gallery
                        if (mediaPermission?.granted) {
                            try {
                                const asset = await MediaLibrary.createAssetAsync(video.uri);
                                await MediaLibrary.createAlbumAsync('Pillara Videos', asset, false);
                                console.log('Video saved to Pillara Videos');
                            } catch (saveErr) {
                                console.error('Failed to save to gallery:', saveErr);
                            }
                        } else {
                            await requestMediaPermission();
                        }

                        onCapture({ uri: video.uri, type: 'video' });
                    }
                } catch (e) {
                    console.error('Recording error:', e);
                    setIsRecording(false);
                }
            }
        }
    };

    const animatedShutterStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: shutterScale.value }],
            backgroundColor: isRecording ? '#E74C3C' : '#10D9A5',
        };
    });

    const animatedOverlayStyle = useAnimatedStyle(() => {
        let backgroundColor = 'transparent';
        if (videoStyle === 'vibrant') backgroundColor = 'rgba(255, 100, 0, 0.15)';
        if (videoStyle === 'cinematic') backgroundColor = 'rgba(0, 100, 255, 0.15)';
        if (videoStyle === 'monochrome') backgroundColor = 'rgba(0, 0, 0, 0.4)';

        return {
            backgroundColor: withTiming(backgroundColor, { duration: 500 }),
        };
    });

    if (!visible) return null;

    // Loading state while permission status is being determined
    if (!permission) {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.fullscreenOverlay}>
                    <ActivityIndicator size="large" color="#10D9A5" />
                </View>
            </Modal>
        );
    }

    if (!permission.granted) {
        return (
            <Modal visible={visible} animationType="slide">
                <View style={styles.permissionContainer}>
                    <Icon name="camera" size={64} color="#10D9A5" style={{ marginBottom: 20 }} />
                    <Text style={styles.permissionTitle}>Camera Access Required</Text>
                    <Text style={styles.permissionText}>
                        We need your permission to use the camera for scanning medications.
                    </Text>

                    {permission.canAskAgain ? (
                        <TouchableOpacity onPress={requestPermission} style={styles.grantButton}>
                            <Text style={styles.grantButtonText}>Grant Permission</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.grantButton}>
                            <Text style={styles.grantButtonText}>Open Settings</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={onClose} style={styles.closeLink}>
                        <Text style={styles.closeLinkText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    const renderStyleSelector = () => {
        if (mode !== 'video') return null;

        const stylesList: VideoStyle[] = ['default', 'vibrant', 'cinematic', 'monochrome'];

        return (
            <View style={styles.styleSelector}>
                {stylesList.map((style) => (
                    <TouchableOpacity
                        key={style}
                        onPress={() => setVideoStyle(style)}
                        style={[
                            styles.styleOption,
                            videoStyle === style && styles.styleOptionActive
                        ]}
                    >
                        <Text style={[
                            styles.styleOptionText,
                            videoStyle === style && styles.styleOptionTextActive
                        ]}>
                            {style.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                <CameraView
                    ref={cameraRef}
                    style={StyleSheet.absoluteFill}
                    facing={facing}
                    mode={mode}
                    flash={flashMode}
                    zoom={zoom}
                >
                    {/* Camera Filter Overlays */}
                    <Animated.View
                        pointerEvents="none"
                        style={[StyleSheet.absoluteFill, animatedOverlayStyle]}
                    />

                    <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                                <Icon name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={styles.headerRight}>
                                <TouchableOpacity
                                    onPress={() => setFlashMode(f => f === 'off' ? 'on' : 'off')}
                                    style={styles.headerButton}
                                >
                                    <Icon
                                        name={flashMode === 'on' ? 'flash' : 'flash-off'}
                                        size={24}
                                        color={flashMode === 'on' ? 'yellow' : 'white'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
                                    style={[styles.headerButton, { marginLeft: 15 }]}
                                >
                                    <Icon name="refresh" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Focus Guide / Scroller */}
                        <ScanOverlay />

                        {/* Footer Controls */}
                        <View style={styles.footer}>
                            {renderStyleSelector()}

                            {/* Mode Switcher */}
                            <View style={styles.modeSwitcher}>
                                <TouchableOpacity
                                    onPress={() => setMode('picture')}
                                    style={[styles.modeButton, mode === 'picture' && styles.modeButtonActive]}
                                >
                                    <Text style={[styles.modeButtonText, mode === 'picture' && styles.modeButtonTextActive]}>PHOTO</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setMode('video')}
                                    style={[styles.modeButton, mode === 'video' && styles.modeButtonActive]}
                                >
                                    <Text style={[styles.modeButtonText, mode === 'video' && styles.modeButtonTextActive]}>VIDEO</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Shutter */}
                            <TouchableOpacity
                                onPress={handleCapture}
                                activeOpacity={0.8}
                                style={styles.shutterOuter}
                            >
                                <Animated.View style={[styles.shutterInner, animatedShutterStyle]}>
                                    {isRecording && <View style={styles.recordingSquare} />}
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </CameraView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    fullscreenOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#0F1E1C',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    permissionTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    permissionText: {
        color: '#A0AEC0',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    grantButton: {
        backgroundColor: '#10D9A5',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    grantButtonText: {
        color: '#0F1E1C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeLink: {
        marginTop: 20,
    },
    closeLinkText: {
        color: 'white',
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerRight: {
        flexDirection: 'row',
    },
    headerButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    styleSelector: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 4,
    },
    styleOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    styleOptionActive: {
        backgroundColor: 'rgba(16, 217, 165, 0.2)',
    },
    styleOptionText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: 'bold',
    },
    styleOptionTextActive: {
        color: '#10D9A5',
    },
    modeSwitcher: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        padding: 4,
        marginBottom: 25,
    },
    modeButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    modeButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    modeButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    modeButtonTextActive: {
        color: '#10D9A5',
    },
    shutterOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutterInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingSquare: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 4,
    }
});

export default CustomCameraView;
