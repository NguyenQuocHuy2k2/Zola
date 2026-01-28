import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Text, useTheme, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addressService, Address } from '@/services/address.service';
import { formatFullAddress } from '@/utils/format';
import { useRouter } from 'expo-router';

interface AddressSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (address: Address) => void;
    currentAddressId?: string;
}

export const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
    visible,
    onClose,
    onSelect,
    currentAddressId
}) => {
    const theme = useTheme();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadAddresses();
        }
    }, [visible]);

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Failed to load addresses', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Chọn địa chỉ nhận hàng</Text>
                        <IconButton icon="close" size={24} onPress={onClose} />
                    </View>
                    <Divider />

                    {loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.listContent}>
                            {addresses.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <MaterialCommunityIcons name="map-marker-off-outline" size={64} color="#CCC" />
                                    <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào</Text>
                                </View>
                            ) : (
                                addresses.map((addr) => (
                                    <TouchableOpacity
                                        key={addr.id}
                                        style={[
                                            styles.addressItem,
                                            currentAddressId === addr.id && styles.selectedItem
                                        ]}
                                        onPress={() => onSelect(addr)}
                                    >
                                        <View style={styles.addressInfo}>
                                            <MaterialCommunityIcons 
                                                name={currentAddressId === addr.id ? "check-circle" : "map-marker-outline"} 
                                                size={22} 
                                                color={currentAddressId === addr.id ? theme.colors.primary : "#666"} 
                                            />
                                            <View style={styles.textContainer}>
                                                <View style={styles.nameRow}>
                                                    <Text style={[
                                                        styles.addressText,
                                                        currentAddressId === addr.id && { color: theme.colors.primary, fontWeight: 'bold' }
                                                    ]}>
                                                        {formatFullAddress(addr)}
                                                    </Text>
                                                    {addr.isDefault && (
                                                        <View style={styles.defaultBadge}>
                                                            <Text style={styles.defaultText}>Mặc định</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        minHeight: '40%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 8,
        paddingVertical: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    listContent: {
        padding: 20,
        gap: 12,
    },
    addressItem: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    selectedItem: {
        backgroundColor: '#F0F9F4',
        borderColor: '#528F72',
    },
    addressInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    textContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    defaultBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    center: {
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    }
});
