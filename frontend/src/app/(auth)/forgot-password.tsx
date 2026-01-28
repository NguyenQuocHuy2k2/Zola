import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '@/services/auth.service';

import { ForgotPasswordInit } from '@/components/auth/forgot-password/forgot-password-init';
import { ForgotPasswordVerify } from '@/components/auth/forgot-password/forgot-password-verify';
import { ForgotPasswordReset } from '@/components/auth/forgot-password/forgot-password-reset';
import { ForgotPasswordSuccess } from '@/components/auth/forgot-password/forgot-password-success';

const OTP_RESEND_SECONDS = 60;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()\{\}\[\]!~`|])(?=.*\d).*$/;

export default function ForgotPasswordScreen() {
    // step 1: init, step 2: verify otp, step 3: reset password, step 4: success
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // info: identifier, maskedEmail, otp
    const [identifier, setIdentifier] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // set new password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // loading, error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const theme = useTheme();

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const startCountdown = () => {
        setCountdown(OTP_RESEND_SECONDS);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleInitForgotPassword = async () => {
        if (!identifier.trim()) {
            setError('Vui lòng nhập tên đăng nhập, số điện thoại hoặc email');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const masked = await authService.initForgotPassword(identifier.trim());
            setMaskedEmail(masked);
            setStep(2);
            startCountdown();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không tìm thấy tài khoản. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;
        setLoading(true);
        setError('');
        try {
            await authService.initForgotPassword(identifier.trim());
            setOtp('');
            startCountdown();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể gửi lại mã OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOTP = async () => {
        if (otp.trim().length !== 6) {
            setError('Vui lòng nhập đúng mã OTP 6 chữ số');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = await authService.verifyForgotPasswordOtp(identifier.trim(), otp.trim());
            setResetToken(token);
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ mật khẩu');
            return;
        }
        if (newPassword.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }
        if (!PASSWORD_REGEX.test(newPassword)) {
            setError('Mật khẩu phải có chữ hoa, chữ thường, chữ số và ký tự đặc biệt');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.resetForgotPassword(identifier.trim(), resetToken, newPassword);
            setStep(4);
        } catch (err: any) {
            const msg = err.response?.data?.message || '';
            if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('invalid')) {
                setError('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
                setStep(2);
                setOtp('');
            } else {
                setError(msg || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 3) { setStep(2); setError(''); }
        else if (step === 2) { setStep(1); setError(''); setOtp(''); setMaskedEmail(''); }
        else router.back();
    };

    if (step === 1) {
        return (
            <ForgotPasswordInit
                identifier={identifier}
                setIdentifier={setIdentifier}
                onNext={handleInitForgotPassword}
                onLoginPress={() => router.push('/(auth)/login')}
                loading={loading}
                error={error}
            />
        );
    }

    if (step === 4) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ForgotPasswordSuccess onBackToLogin={() => router.replace('/(auth)/login')} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="#1D1D1D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quên mật khẩu</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {step === 2 ? (
                        <ForgotPasswordVerify
                            otp={otp}
                            setOtp={setOtp}
                            onResendOTP={handleResendOTP}
                            countdown={countdown}
                            maskedEmail={maskedEmail}
                            error={error}
                        />
                    ) : (
                        <ForgotPasswordReset
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            showNewPassword={showNewPassword}
                            setShowNewPassword={setShowNewPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            error={error}
                        />
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={step === 2 ? handleConfirmOTP : handleResetPassword}
                        loading={loading}
                        disabled={loading || (step === 2 && otp.length !== 6)}
                        style={styles.saveBtn}
                        labelStyle={styles.saveBtnLabel}
                        buttonColor={theme.colors.primary}
                    >
                        {step === 2 ? 'Tiếp tục' : 'Đặt lại mật khẩu'}
                    </Button>
                </View>
            </KeyboardAvoidingView>
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
    footer: { paddingHorizontal: 30, paddingBottom: 40, paddingTop: 10 },
    saveBtn: { borderRadius: 30, paddingVertical: 8 },
    saveBtnLabel: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
