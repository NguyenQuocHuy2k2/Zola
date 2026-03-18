import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AvatarSectionProps {
    avatarUri: string | null;
    userAvatarUrl?: string;
    uploadingAvatar: boolean;
    onPickAvatar: () => void;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
    avatarUri,
    userAvatarUrl,
    uploadingAvatar,
    onPickAvatar,
}) => {
    return (
        <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onPickAvatar}
            disabled={uploadingAvatar}
        >
            <Avatar.Image
                size={100}
                source={{ uri: avatarUri || userAvatarUrl || 'https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg' }}
                style={styles.avatar}
            />
            {uploadingAvatar && (
                <View style={styles.avatarLoadingOverlay}>
                    <ActivityIndicator color="#FFF" size="small" />
                </View>
            )}
            <View style={styles.cameraIconContainer}>
                <MaterialCommunityIcons name="camera-outline" size={20} color="#FFF" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    avatar: {
        backgroundColor: '#EAEAEA',
    },
    avatarLoadingOverlay: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: '#2b2b2b',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
});
