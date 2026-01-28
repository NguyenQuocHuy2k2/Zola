import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CheckoutInfoProps {
    address: string;
    phone: string;
    setPhone: (phone: string) => void;
    onOpenAddressModal: () => void;
}

export const CheckoutInfo = ({
    address,
    phone,
    setPhone,
    onOpenAddressModal
}: CheckoutInfoProps) => {
    const theme = useTheme();

    return (
        <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
                <TouchableOpacity 
                    style={styles.changeAddressBtn}
                    onPress={onOpenAddressModal}
                >
                    <Text style={[styles.changeAddressText, { color: theme.colors.primary }]}>Thay đổi</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.addressDisplayCard}>
                {address ? (
                    <TouchableOpacity 
                        style={styles.addressDisplayInfo}
                        onPress={onOpenAddressModal}
                    >
                        <Text style={styles.displayAddressText}>{address}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={styles.emptyAddressContainer}
                        onPress={onOpenAddressModal}
                    >
                        <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#999" />
                        <Text style={styles.emptyAddressText}>Bấm để chọn địa chỉ nhận hàng</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={[styles.inputGroup, { marginTop: 16 }]}>
                <TextInput
                    mode="outlined"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại..."
                    keyboardType="phone-pad"
                    style={styles.input}
                    outlineColor="#EAEAEA"
                    activeOutlineColor={theme.colors.primary}
                    dense
                    left={<TextInput.Icon icon="phone-outline" size={20} color="#666" />}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
    },
    changeAddressBtn: {
        marginLeft: 'auto',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    changeAddressText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    addressDisplayCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    addressDisplayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    displayAddressText: {
        fontSize: 14,
        color: '#222',
        lineHeight: 20,
        fontWeight: '500',
    },
    emptyAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 12,
    },
    emptyAddressText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#FAFAFA',
        fontSize: 14,
    },
});
