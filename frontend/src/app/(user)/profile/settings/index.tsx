import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profile.service';
import { AvatarSection } from '@/components/profile-setting/avatar-section';
import { ProfileForm } from '@/components/profile-setting/profile-form';
import { ProfileModal } from '@/components/profile-setting/profile-modal-success';

type ModalState = { visible: boolean; success: boolean; message: string };

export default function ProfileSettingsScreen() {
    const { user, updateUserContext } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<ModalState>({ visible: false, success: true, message: '' });

    const handlePickAvatar = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setModal({ visible: true, success: false, message: 'Vui lòng cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets?.[0]?.uri) return;

        const uri = result.assets[0].uri;
        setAvatarUri(uri);
        setUploadingAvatar(true);
        try {
            const newAvatarUrl = await profileService.uploadAvatar(uri);
            await updateUserContext({ ...user!, avatarUrl: newAvatarUrl });
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.';
            setAvatarUri(null);
            setModal({ visible: true, success: false, message: msg });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const hasChanges = useMemo(() => (
        firstName !== (user?.firstName || '') ||
        lastName !== (user?.lastName || '') ||
        phone !== (user?.phone || '')
    ), [firstName, lastName, phone, user]);

    const handleSave = async () => {
        if (!user) return;

        if (!firstName.trim() || !lastName.trim()) {
            setModal({ visible: true, success: false, message: 'Họ và tên không được để trống' });
            return;
        }

        setLoading(true);
        try {
            const updatedUser = await profileService.updateProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
            });
            await updateUserContext(updatedUser);
            setModal({ visible: true, success: true, message: 'Thông tin cá nhân đã được cập nhật thành công!' });
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.';
            setModal({ visible: true, success: false, message: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModal(m => ({ ...m, visible: false }));
        if (modal.success) router.back();
    };

    if (!user) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="#1D1D1D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <AvatarSection 
                        avatarUri={avatarUri}
                        userAvatarUrl={user.avatarUrl}
                        uploadingAvatar={uploadingAvatar}
                        onPickAvatar={handlePickAvatar}
                    />

                    <ProfileForm 
                        username={user.username}
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        email={user.email || ''}
                        phone={phone}
                        setPhone={setPhone}
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={loading}
                        disabled={loading || !hasChanges}
                        style={styles.saveBtn}
                        labelStyle={styles.saveBtnLabel}
                        buttonColor={theme.colors.primary}
                    >
                        Lưu thay đổi
                    </Button>
                </View>
            </KeyboardAvoidingView>

            <ProfileModal 
                visible={modal.visible}
                success={modal.success}
                message={modal.message}
                onClose={handleModalClose}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 20,
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 40,
        paddingTop: 10,
    },
    saveBtn: {
        borderRadius: 30,
        paddingVertical: 8,
    },
    saveBtnLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
