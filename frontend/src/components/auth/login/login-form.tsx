import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface LoginFormProps {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
    onLogin: () => void;
    loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    onLogin,
    loading
}) => {
    const theme = useTheme();
    const router = useRouter();

    return (
        <>
            <TextInput
                label="Tên đăng nhập hoặc Số điện thoại"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="default"
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(v => !v)}
                    />
                }
            />

            <View style={styles.forgotPasswordContainer}>
                <Text
                    style={{ color: theme.colors.primary }}
                    onPress={() => router.push('/(auth)/forgot-password')}
                >
                    Quên mật khẩu?
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={onLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                Đăng nhập
            </Button>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
});
