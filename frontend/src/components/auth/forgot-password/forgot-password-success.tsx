import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ForgotPasswordSuccessProps {
    onBackToLogin: () => void;
}

export const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({ onBackToLogin }) => {
    const theme = useTheme();

    return (
        <View style={styles.successContainer}>
            <View style={[styles.successIconCircle, { backgroundColor: '#F0FFF4' }]}>
                <MaterialCommunityIcons name="check-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Thành công!</Text>
            <Text style={styles.successSubtitle}>
                Mật khẩu của bạn đã được đặt lại. Hãy đăng nhập bằng mật khẩu mới.
            </Text>
            <Button
                mode="contained"
                onPress={onBackToLogin}
                style={styles.successBtn}
                labelStyle={styles.saveBtnLabel}
                buttonColor={theme.colors.primary}
            >
                Về Đăng nhập
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    successIconCircle: {
        width: 120, height: 120, borderRadius: 60,
        justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    },
    successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#1D1D1D' },
    successSubtitle: {
        fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 8,
    },
    successBtn: { borderRadius: 30, paddingVertical: 8, width: '100%' },
    saveBtnLabel: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
