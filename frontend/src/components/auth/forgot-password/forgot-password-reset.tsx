import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ForgotPasswordResetProps {
    newPassword: string;
    setNewPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    showNewPassword: boolean;
    setShowNewPassword: (value: boolean | ((v: boolean) => boolean)) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (value: boolean | ((v: boolean) => boolean)) => void;
    error: string;
}

export const ForgotPasswordReset: React.FC<ForgotPasswordResetProps> = ({
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    error,
}) => {
    const theme = useTheme();

    return (
        <View>
            <View style={styles.infoBanner}>
                <MaterialCommunityIcons name="shield-lock-outline" size={32} color={theme.colors.primary} />
                <Text style={styles.infoText}>Đặt mật khẩu mới cho tài khoản</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu mới</Text>
                <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    style={styles.input}
                    textColor="#1D1D1D"
                    cursorColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                    right={
                        <TextInput.Icon
                            icon={showNewPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowNewPassword(v => !v)}
                            color="#999"
                        />
                    }
                />
                <View style={styles.bottomLine} />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    textColor="#1D1D1D"
                    cursorColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                    right={
                        <TextInput.Icon
                            icon={showConfirmPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowConfirmPassword(v => !v)}
                            color="#999"
                        />
                    }
                />
                <View style={styles.bottomLine} />
            </View>

            <Text style={styles.hint}>
                Mật khẩu gồm ≥8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.
            </Text>
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
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 12, color: '#A0A0A0', marginBottom: -5, fontWeight: '500' },
    input: {
        height: 45, paddingHorizontal: 0,
        backgroundColor: 'transparent', fontSize: 16, fontWeight: '500',
    },
    bottomLine: { height: 1, backgroundColor: '#EAEAEA', width: '100%' },
    hint: { fontSize: 12, color: '#888', lineHeight: 18, marginTop: -8 },
});
