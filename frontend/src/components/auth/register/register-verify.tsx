import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import OtpInput from '@/components/ui/otp-Input';

interface RegisterVerifyProps {
    email: string;
    otp: string;
    setOtp: (v: string) => void;
    onVerify: () => void;
    onBack: () => void;
    loading: boolean;
}

export const RegisterVerify: React.FC<RegisterVerifyProps> = ({
    email,
    otp,
    setOtp,
    onVerify,
    onBack,
    loading
}) => {
    const theme = useTheme();

    return (
        <>
            <Text style={styles.infoText}>
                Mã OTP đã được gửi đến{' '}
                <Text style={styles.boldText}>{email}</Text>
            </Text>

            <OtpInput
                value={otp}
                onChange={setOtp}
                primaryColor={theme.colors.primary}
            />

            <Button
                mode="contained"
                onPress={onVerify}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                Xác nhận & Đăng ký
            </Button>

            <Button
                mode="text"
                onPress={onBack}
                disabled={loading}
                style={styles.backButton}
            >
                Quay lại
            </Button>
        </>
    );
};

const styles = StyleSheet.create({
    infoText: {
        marginBottom: 28,
        textAlign: 'center',
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    backButton: {
        marginTop: 8,
    },
});
