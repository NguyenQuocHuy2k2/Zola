import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatFullAddress } from '@/utils/format';
import { Address } from '@/services/address.service';

interface AddressItemProps {
    address: Address;
    onSetDefault: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (address: Address) => void;
}

export const AddressItem: React.FC<AddressItemProps> = ({
    address,
    onSetDefault,
    onEdit,
    onDelete,
}) => {
    const theme = useTheme();


    return (
        <View style={styles.card}>
            {/* Left: address info */}
            <View style={styles.cardLeft}>
                <View style={styles.addressRow}>
                    <MaterialCommunityIcons 
                        name="map-marker-outline" 
                        size={16} 
                        color="#888" 
                        style={{ marginRight: 6, marginTop: 2 }} 
                    />
                    <Text style={styles.addressText}>{formatFullAddress(address)}</Text>
                </View>
                {!address.isDefault && (
                    <TouchableOpacity
                        style={styles.setDefaultBtn}
                        onPress={() => onSetDefault(address.id)}
                    >
                        <MaterialCommunityIcons 
                            name="star-outline" 
                            size={13} 
                            color={theme.colors.primary} 
                        />
                        <Text style={[styles.setDefaultText, { color: theme.colors.primary }]}>
                            Đặt mặc định
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Right: badge + icon actions */}
            <View style={styles.cardRight}>
                {address.isDefault && (
                    <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Mặc định</Text>
                    </View>
                )}
                <View style={styles.iconActions}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => onEdit(address.id)}
                    >
                        <MaterialCommunityIcons name="pencil-outline" size={19} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => onDelete(address)}
                    >
                        <MaterialCommunityIcons name="trash-can-outline" size={19} color="#E53935" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLeft: {
        flex: 1,
        marginRight: 12,
    },
    cardRight: {
        alignItems: 'flex-end',
        gap: 10,
    },
    defaultBadge: {
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginLeft: 8,
    },
    defaultBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2E7D32',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    addressText: {
        fontSize: 13,
        color: '#666666',
        flex: 1,
        lineHeight: 18,
    },
    setDefaultBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        marginLeft: 22,
    },
    setDefaultText: {
        fontSize: 12,
        fontWeight: '500',
    },
    iconActions: {
        flexDirection: 'row',
        gap: 4,
    },
    iconBtn: {
        padding: 6,
    },
});
