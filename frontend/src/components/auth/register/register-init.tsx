import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { UserCreationRequest } from '@/services/auth.service';

interface RegisterInitProps {
    formData: UserCreationRequest;
    updateFormData: (field: keyof UserCreationRequest, value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
    onContinue: () => void;
    loading: boolean;
}

export const RegisterInit: React.FC<RegisterInitProps> = ({
    formData,
    updateFormData,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    onContinue,
    loading
}) => {
    const theme = useTheme();

    return (
        <>
            <TextInput
                label="Tên đăng nhập"
                value={formData.username}
                onChangeText={(v) => updateFormData('username', v)}
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
            />

            <View style={styles.row}>
                <TextInput
                    label="Họ"
                    value={formData.lastName}
                    onChangeText={(v) => updateFormData('lastName', v)}
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    mode="outlined"
                />
                <TextInput
                    label="Tên"
                    value={formData.firstName}
                    onChangeText={(v) => updateFormData('firstName', v)}
                    style={[styles.input, { flex: 1 }]}
                    mode="outlined"
                />
            </View>

            <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(v) => updateFormData('email', v)}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Số điện thoại"
                value={formData.phone}
                onChangeText={(v) => updateFormData('phone', v)}
                keyboardType="phone-pad"
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Mật khẩu"
                value={formData.password}
                onChangeText={(v) => updateFormData('password', v)}
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

            <TextInput
                label="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(v => !v)}
                    />
                }
            />

            <Button
                mode="contained"
                onPress={onContinue}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                Tiếp tục
            </Button>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
});
