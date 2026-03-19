import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';

interface ProductListHeaderProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    productCount: number;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
}

export default function ProductListHeader({
    searchQuery,
    onSearchChange,
    productCount,
    statusFilter,
    onStatusFilterChange,
}: ProductListHeaderProps) {
    const [visible, setVisible] = useState(false);

    const statusOptions = [
        { label: 'Tất cả', value: '' },
        { label: 'Đang bán', value: 'ACTIVE' },
        { label: 'Hết hàng', value: 'OUT_OF_STOCK' },
        { label: 'Đã lưu trữ', value: 'ARCHIVED' },
    ];

    const selectedStatus =
        statusOptions.find((opt) => opt.value === statusFilter)?.label ||
        'Tất cả';

    return (
        <View style={styles.container}>
            <Text variant="headlineSmall" style={styles.title}>
                Sản phẩm
            </Text>
            <Searchbar
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChangeText={onSearchChange}
                style={styles.search}
            />
            <View style={styles.filterContainer}>
                <Text variant="bodyMedium" style={styles.filterLabel}>
                    Trạng thái:
                </Text>
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                        <TouchableOpacity
                            style={styles.menuAnchor}
                            onPress={() => setVisible(true)}
                        >
                            <Text style={styles.menuText}>
                                {selectedStatus}
                            </Text>
                            <IconButton
                                icon="chevron-down"
                                size={20}
                                style={styles.iconButton}
                            />
                        </TouchableOpacity>
                    }
                    style={styles.menu}
                >
                    {statusOptions.map((option) => (
                        <Menu.Item
                            key={option.value}
                            onPress={() => {
                                onStatusFilterChange(option.value);
                                setVisible(false);
                            }}
                            title={option.label}
                        />
                    ))}
                </Menu>
            </View>
            <Text variant="bodyMedium" style={styles.count}>
                {productCount} sản phẩm
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    search: {
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    filterLabel: {
        marginRight: 8,
    },
    menuAnchor: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuText: {
        fontSize: 14,
        color: '#333',
    },
    iconButton: {
        margin: 0,
        marginLeft: 8,
    },
    menu: {
        marginTop: 0,
    },
    count: {
        color: '#888',
        marginBottom: 8,
    },
});
