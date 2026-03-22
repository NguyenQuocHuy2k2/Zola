import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import OtpInput from '@/components/ui/otp-input';

interface ChangePasswordVerifyProps {
    otp: string;
    setOtp: (v: string) => void;
    countdown: number;
    onResend: () => void;
}

export const ChangePasswordVerify: React.FC<ChangePasswordVerifyProps> = ({
    otp, setOtp,
    countdown,
    onResend
}) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
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
                        onPress={onResend}
                    >
                        Gửi lại
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    resendLabel: {
        fontSize: 13,
        color: '#666',
    },
    resendLink: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    countdown: {
        fontSize: 13,
        color: '#999',
    },
});
