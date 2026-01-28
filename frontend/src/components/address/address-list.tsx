import React from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Address } from '@/services/address.service';
import { AddressItem } from './address-item';

interface AddressListProps {
    addresses: Address[];
    refreshing: boolean;
    onRefresh: () => void;
    onSetDefault: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (address: Address) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
    addresses,
    refreshing,
    onRefresh,
    onSetDefault,
    onEdit,
    onDelete,
}) => {
    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
        >
            {addresses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="map-marker-off-outline" size={72} color="#CCCCCC" />
                    <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào</Text>
                    <Text style={styles.emptySubText}>Thêm địa chỉ để đặt hàng nhanh hơn</Text>
                </View>
            ) : (
                addresses.map((addr) => (
                    <AddressItem
                        key={addr.id}
                        address={addr}
                        onSetDefault={onSetDefault}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 24,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        gap: 10,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888',
        marginTop: 12,
    },
    emptySubText: {
        fontSize: 13,
        color: '#AAAAAA',
        textAlign: 'center',
    },
});
