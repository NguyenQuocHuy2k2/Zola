import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addressService, Address } from '@/services/address.service';
import { AddressList } from '@/components/address/address-list';
import ConfirmModal from '@/components/ui/confirm-modal';
import StatusModal, { StatusType } from '@/components/ui/status-modal';

export default function AddressesScreen() {
    const router = useRouter();
    const theme = useTheme();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal states
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState<StatusType>('success');
    const [statusTitle, setStatusTitle] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const fetchAddresses = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
        }, [])
    );

    const handleSetDefault = async (id: string) => {
        try {
            await addressService.setDefault(id);
            fetchAddresses(false);
        } catch {
            showStatus('error', 'Lỗi', 'Không thể đặt mặc định địa chỉ này.');
        }
    };

    const handleDelete = (address: Address) => {
        setAddressToDelete(address);
        setConfirmModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;
        setConfirmModalVisible(false);
        try {
            await addressService.deleteAddress(addressToDelete.id);
            fetchAddresses(false);
        } catch {
            showStatus('error', 'Lỗi', 'Không thể xoá địa chỉ.');
        } finally {
            setAddressToDelete(null);
        }
    };

    const showStatus = (type: StatusType, title: string, message: string) => {
        setStatusType(type);
        setStatusTitle(title);
        setStatusMessage(message);
        setStatusModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <IconButton 
                    icon="chevron-left" 
                    size={28} 
                    onPress={() => router.back()} 
                    style={styles.backBtn} 
                />
                <Text style={styles.headerTitle}>Địa chỉ của tôi</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <AddressList
                    addresses={addresses}
                    refreshing={refreshing}
                    onRefresh={() => { setRefreshing(true); fetchAddresses(false); }}
                    onSetDefault={handleSetDefault}
                    onEdit={(id) => router.push({ pathname: '/profile/address/form', params: { addressId: id } })}
                    onDelete={handleDelete}
                />
            )}

            {/* Add button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
                    onPress={() => router.push('/profile/address/form')}
                    activeOpacity={0.85}
                >
                    <MaterialCommunityIcons name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.addBtnText}>Thêm địa chỉ mới</Text>
                </TouchableOpacity>
            </View>

            <ConfirmModal
                visible={confirmModalVisible}
                title="Xoá địa chỉ"
                message="Bạn có chắc chắn muốn xoá địa chỉ này không?"
                confirmLabel="Xoá"
                confirmColor="#FF5252"
                icon="trash-can-outline"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmModalVisible(false);
                    setAddressToDelete(null);
                }}
            />

            <StatusModal
                visible={statusModalVisible}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
                onClose={() => setStatusModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        backgroundColor: '#F8F9FA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 14,
    },
    addBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
