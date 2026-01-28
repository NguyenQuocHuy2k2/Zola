import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';

interface ForgotPasswordInitProps {
    identifier: string;
    setIdentifier: (value: string) => void;
    onNext: () => void;
    onLoginPress: () => void;
    loading: boolean;
    error: string;
}

export const ForgotPasswordInit: React.FC<ForgotPasswordInitProps> = ({
    identifier,
    setIdentifier,
    onNext,
    onLoginPress,
    loading,
    error,
}) => {
    const theme = useTheme();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text variant="displaySmall" style={styles.title}>Quên mật khẩu</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Nhập thông tin tài khoản để nhận mã xác nhận
                    </Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TextInput
                        label="Tên đăng nhập, SĐT hoặc email"
                        value={identifier}
                        onChangeText={setIdentifier}
                        autoCapitalize="none"
                        style={styles.outlinedInput}
                        mode="outlined"
                    />
                    <Button
                        mode="contained"
                        onPress={onNext}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                    >
                        Tiếp tục
                    </Button>

                    <View style={styles.loginContainer}>
                        <Text>Nhớ mật khẩu? </Text>
                        <Text
                            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
                            onPress={onLoginPress}
                        >
                            Đăng nhập ngay
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flexGrow: 1 },
    formContainer: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: 32, opacity: 0.7, lineHeight: 22 },
    errorText: { color: '#D32F2F', fontSize: 13, textAlign: 'center', marginBottom: 16 },
    outlinedInput: { marginBottom: 16 },
    button: { marginTop: 8, paddingVertical: 6 },
    loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
});
