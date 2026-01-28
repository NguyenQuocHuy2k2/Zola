import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface ProfileFormProps {
    username: string;
    firstName: string;
    setFirstName: (v: string) => void;
    lastName: string;
    setLastName: (v: string) => void;
    email: string;
    phone: string;
    setPhone: (v: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
    username,
    firstName, setFirstName,
    lastName, setLastName,
    email,
    phone, setPhone,
}) => {
    return (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên đăng nhập</Text>
                <TextInput
                    value={username}
                    editable={false}
                    style={[styles.input, { opacity: 0.5 }]}
                    textColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                />
                <View style={styles.bottomLine} />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { marginRight: 8 }]}>
                    <Text style={styles.label}>Họ</Text>
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.input}
                        textColor="#1D1D1D"
                        cursorColor="#1D1D1D"
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        theme={{ colors: { background: 'transparent' } }}
                    />
                    <View style={styles.bottomLine} />
                </View>
                <View style={[styles.inputGroup, { marginLeft: 8 }]}>
                    <Text style={styles.label}>Tên</Text>
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                        textColor="#1D1D1D"
                        cursorColor="#1D1D1D"
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        theme={{ colors: { background: 'transparent' } }}
                    />
                    <View style={styles.bottomLine} />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    value={email}
                    editable={false}
                    style={[styles.input, { opacity: 0.5 }]}
                    textColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                />
                <View style={styles.bottomLine} />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.input}
                    textColor="#1D1D1D"
                    cursorColor="#1D1D1D"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { background: 'transparent' } }}
                />
                <View style={styles.bottomLine} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    inputGroup: {
        flex: 1,
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
});
