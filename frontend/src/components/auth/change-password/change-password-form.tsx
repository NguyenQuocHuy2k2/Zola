import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface ChangePasswordFormProps {
    oldPassword: string;
    setOldPassword: (v: string) => void;
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    showOld: boolean;
    setShowOld: (v: boolean | ((prev: boolean) => boolean)) => void;
    showNew: boolean;
    setShowNew: (v: boolean | ((prev: boolean) => boolean)) => void;
    showConfirm: boolean;
    setShowConfirm: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showOld, setShowOld,
    showNew, setShowNew,
    showConfirm, setShowConfirm
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu cũ</Text>
                <TextInput
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry={!showOld}
                    style={styles.input}
                    textColor="#1D1D1D"
                    cursorColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                    right={
                        <TextInput.Icon
                            icon={showOld ? 'eye-off' : 'eye'}
                            onPress={() => setShowOld(v => !v)}
                            color="#999"
                        />
                    }
                />
                <View style={styles.bottomLine} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu mới</Text>
                <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                    style={styles.input}
                    textColor="#1D1D1D"
                    cursorColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                    right={
                        <TextInput.Icon
                            icon={showNew ? 'eye-off' : 'eye'}
                            onPress={() => setShowNew(v => !v)}
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
                    secureTextEntry={!showConfirm}
                    style={styles.input}
                    textColor="#1D1D1D"
                    cursorColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                    right={
                        <TextInput.Icon
                            icon={showConfirm ? 'eye-off' : 'eye'}
                            onPress={() => setShowConfirm(v => !v)}
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
    container: {
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        color: '#A0A0A0',
        marginBottom: -5,
        fontWeight: '500',
    },
    input: {
        height: 45,
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: '500',
    },
    bottomLine: {
        height: 1,
        backgroundColor: '#EAEAEA',
        width: '100%',
    },
    hint: {
        fontSize: 12,
        color: '#888',
        lineHeight: 18,
        marginTop: -8,
    },
});
