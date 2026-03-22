import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OtpInput from '@/components/ui/otp-input';

interface ForgotPasswordVerifyProps {
    otp: string;
    setOtp: (value: string) => void;
    onResendOTP: () => void;
    countdown: number;
    maskedEmail: string;
    error: string;
}

export const ForgotPasswordVerify: React.FC<ForgotPasswordVerifyProps> = ({
    otp,
    setOtp,
    onResendOTP,
    countdown,
    maskedEmail,
    error,
}) => {
    const theme = useTheme();

    return (
        <View>
            {/* Info banner */}
            <View style={styles.infoBanner}>
                <MaterialCommunityIcons name="shield-lock-outline" size={32} color={theme.colors.primary} />
                <Text style={styles.infoText}>
                    {`Mã OTP đã gửi đến\n${maskedEmail}`}
                </Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <OtpInput
                value={otp}
                onChange={setOtp}
                primaryColor={theme.colors.primary}
            />

            <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Không nhận được mã? </Text>
                {countdown > 0 ? (
                    <Text style={styles.countdown}>Gửi lại sau {countdown}s</Text>
                ) : (
                    <Text
                        style={[styles.resendLink, { color: theme.colors.primary }]}
                        onPress={onResendOTP}
                    >
                        Gửi lại
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoBanner: {
        alignItems: 'center',
        backgroundColor: '#F5F9FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 28,
        gap: 10,
    },
    infoText: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 22 },
    errorText: { color: '#D32F2F', fontSize: 13, textAlign: 'center', marginBottom: 16 },
    resendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 24 },
    resendLabel: { fontSize: 13, color: '#666' },
    resendLink: { fontSize: 13, fontWeight: 'bold' },
    countdown: { fontSize: 13, color: '#999' },
});
