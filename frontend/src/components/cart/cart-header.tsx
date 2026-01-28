import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartHeader() {
    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
            <View style={{ width: 44 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: -10,
    },
});
