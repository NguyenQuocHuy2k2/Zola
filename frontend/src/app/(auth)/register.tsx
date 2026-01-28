import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { authService, UserCreationRequest } from '@/services/auth.service';
import { RegisterInit } from '@/components/auth/register/register-init';
import { RegisterVerify } from '@/components/auth/register/register-verify';

export default function RegisterScreen() {
    // step 1: register init, step 2: register verify
    const [step, setStep] = useState<1 | 2>(1);

    // info: user creation request
    const [formData, setFormData] = useState<UserCreationRequest>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // otp
    const [otp, setOtp] = useState('');

    // loading
    const [loading, setLoading] = useState(false);

    // error
    const [error, setError] = useState('');

    const router = useRouter();
    const { signIn } = useAuth();
    const theme = useTheme();

    const updateFormData = (field: keyof UserCreationRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRequestOTP = async () => {
        const { username, firstName, lastName, email, phone, password } = formData;
        if (!username || !firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await authService.register(formData);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTPAndRegister = async () => {
        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await authService.verifyOTPAndRegister(formData.email, otp);
            await signIn(response);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'OTP không hợp lệ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text variant="displaySmall" style={styles.title}>Đăng ký</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>Tạo tài khoản Zola mới</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {step === 1 ? (
                        <RegisterInit
                            formData={formData}
                            updateFormData={updateFormData}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            onContinue={handleRequestOTP}
                            loading={loading}
                        />
                    ) : (
                        <RegisterVerify
                            email={formData.email}
                            otp={otp}
                            setOtp={setOtp}
                            onVerify={verifyOTPAndRegister}
                            onBack={() => setStep(1)}
                            loading={loading}
                        />
                    )}

                    <View style={styles.loginContainer}>
                        <Text>Đã có tài khoản? </Text>
                        <Text
                            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            Đăng nhập
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.7,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    }
});
