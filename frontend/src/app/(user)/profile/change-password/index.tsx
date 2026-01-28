import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profile.service';
import { ChangePasswordVerify } from '@/components/auth/change-password/change-password-verify';
import { ChangePasswordForm } from '@/components/auth/change-password/change-password-form';

const RESEND_SECONDS = 60;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()\{\}\[\]!~`|])(?=.*\d).*$/;

function maskEmail(email: string) {
    const at = email.indexOf('@');
    if (at <= 1) return email;
    return email.charAt(0) + '***' + email.substring(at);
}

type ModalState = { visible: boolean; success: boolean; message: string };

export default function ChangePasswordScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    // form state
    const [step, setStep] = useState<1 | 2>(1);
    const [otp, setOtp] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changeToken, setChangeToken] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ui state
    const [sending, setSending] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [modal, setModal] = useState<ModalState>({ visible: false, success: true, message: '' });

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCountdown = () => {
        setCountdown(RESEND_SECONDS);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        sendOtp();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const sendOtp = async () => {
        setSending(true);
        setError('');
        try {
            await profileService.sendChangePasswordOtp();
            startCountdown();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setOtp('');
        await sendOtp();
    };

    const handleConfirmOtp = async () => {
        if (otp.length !== 6) {
            setError('Vui lòng nhập đúng mã OTP 6 chữ số');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = await profileService.verifyChangePasswordOtp(otp.trim());
            setChangeToken(token);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ mật khẩu');
            return;
        }
        if (newPassword.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }
        if (!PASSWORD_REGEX.test(newPassword)) {
            setError('Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await profileService.changePassword(oldPassword.trim(), changeToken, newPassword);
            setModal({ visible: true, success: true, message: 'Mật khẩu đã được thay đổi thành công!' });
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
            if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('invalid')) {
                setStep(1);
                setOtp('');
                setError(msg);
            } else {
                setModal({ visible: true, success: false, message: msg });
            }
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
                <TouchableOpacity
                    onPress={() => step === 2 ? (setStep(1), setError('')) : router.back()}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={28} color="#1D1D1D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <View style={styles.infoBanner}>
                        <MaterialCommunityIcons name="shield-lock-outline" size={32} color={theme.colors.primary} />
                        <Text style={styles.infoText}>
                            {sending
                                ? 'Đang gửi mã xác nhận...'
                                : `Mã OTP đã gửi đến\n${maskEmail(user.email || '')}`}
                        </Text>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {step === 1 ? (
                        <ChangePasswordVerify
                            otp={otp}
                            setOtp={setOtp}
                            countdown={countdown}
                            onResend={handleResend}
                        />
                    ) : (
                        <ChangePasswordForm
                            oldPassword={oldPassword}
                            setOldPassword={setOldPassword}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            showOld={showOld}
                            setShowOld={setShowOld}
                            showNew={showNew}
                            setShowNew={setShowNew}
                            showConfirm={showConfirm}
                            setShowConfirm={setShowConfirm}
                        />
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    {step === 1 ? (
                        <Button
                            mode="contained"
                            onPress={handleConfirmOtp}
                            loading={loading}
                            disabled={loading || sending || otp.length !== 6}
                            style={styles.saveBtn}
                            labelStyle={styles.saveBtnLabel}
                            buttonColor={theme.colors.primary}
                        >
                            Tiếp tục
                        </Button>
                    ) : (
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={loading || !newPassword || !confirmPassword}
                            style={styles.saveBtn}
                            labelStyle={styles.saveBtnLabel}
                            buttonColor={theme.colors.primary}
                        >
                            Xác nhận đổi mật khẩu
                        </Button>
                    )}
                </View>
            </KeyboardAvoidingView>

            <Modal transparent animationType="fade" visible={modal.visible} onRequestClose={handleModalClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={[styles.modalIconCircle, { backgroundColor: modal.success ? '#F0FFF4' : '#FFF0F0' }]}>
                            <MaterialCommunityIcons
                                name={modal.success ? 'check-circle' : 'alert-circle'}
                                size={48}
                                color={modal.success ? '#4CAF50' : '#F44336'}
                            />
                        </View>
                        <Text style={styles.modalTitle}>{modal.success ? 'Thành công!' : 'Có lỗi xảy ra'}</Text>
                        <Text style={styles.modalMessage}>{modal.message}</Text>
                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: modal.success ? theme.colors.primary : '#F44336' }]}
                            onPress={handleModalClose}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.modalBtnText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    backButton: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1D1D1D' },
    content: { paddingHorizontal: 30, paddingTop: 16, paddingBottom: 20 },
    infoBanner: {
        alignItems: 'center',
        backgroundColor: '#F5F9FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 28,
        gap: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        lineHeight: 22,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 16,
    },
    footer: { paddingHorizontal: 30, paddingBottom: 40, paddingTop: 10 },
    saveBtn: { borderRadius: 30, paddingVertical: 8 },
    saveBtnLabel: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30,
    },
    modalCard: {
        backgroundColor: '#FFFFFF', borderRadius: 20,
        paddingVertical: 32, paddingHorizontal: 28,
        alignItems: 'center', width: '100%',
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
    },
    modalIconCircle: {
        width: 80, height: 80, borderRadius: 40,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1D1D1D', marginBottom: 8 },
    modalMessage: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    modalBtn: { borderRadius: 30, paddingVertical: 12, paddingHorizontal: 48 },
    modalBtnText: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
});
