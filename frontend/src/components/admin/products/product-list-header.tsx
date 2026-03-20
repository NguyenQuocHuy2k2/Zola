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
        { label: 'Ngừng bán', value: 'DEACTIVE' },
    ];

    const selectedStatus =
        statusOptions.find((opt) => opt.value === statusFilter)?.label ||
        'Tất cả';

    return (
        <View style={styles.container}>
            <View style={styles.headerTop}>
                <Text variant="headlineSmall" style={styles.title}>
                    Sản phẩm
                </Text>
                <View style={styles.countBadge}>
                    <Text variant="bodySmall" style={styles.countText}>
                        {productCount}
                    </Text>
                </View>
            </View>

            <View style={styles.searchRow}>
                <Searchbar
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    style={styles.search}
                    inputStyle={styles.searchInput}
                    iconColor="#666"
                    placeholderTextColor="#999"
                    elevation={0}
                />
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setVisible(true)}
                        >
                            <IconButton
                                icon="tune-variant"
                                size={22}
                                iconColor={statusFilter ? '#1976D2' : '#666'}
                                style={styles.filterIcon}
                            />
                        </TouchableOpacity>
                    }
                    style={styles.menu}
                    contentStyle={styles.menuContent}
                >
                    {statusOptions.map((option) => (
                        <Menu.Item
                            key={option.value}
                            onPress={() => {
                                onStatusFilterChange(option.value);
                                setVisible(false);
                            }}
                            title={option.label}
                            titleStyle={{
                                color:
                                    statusFilter === option.value
                                        ? '#1976D2'
                                        : '#333',
                                fontWeight:
                                    statusFilter === option.value
                                        ? '600'
                                        : '400',
                            }}
                        />
                    ))}
                </Menu>
            </View>

            {statusFilter !== '' && (
                <View style={styles.activeFilterRow}>
                    <Text variant="bodySmall" style={styles.activeFilterLabel}>
                        Lọc theo:
                    </Text>
                    <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>
                            {selectedStatus}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onStatusFilterChange('')}
                        >
                            <IconButton
                                icon="close"
                                size={14}
                                iconColor="#1976D2"
                                style={{ margin: 0, height: 20, width: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    title: {
        fontWeight: '800',
        color: '#1a1a1a',
        letterSpacing: -0.5,
    },
    countBadge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 12,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    search: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        height: 48,
    },
    searchInput: {
        fontSize: 15,
        minHeight: 0,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterIcon: {
        margin: 0,
    },
    menu: {
        marginTop: 48,
    },
    menuContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 4,
    },
    activeFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    activeFilterLabel: {
        color: '#999',
    },
    activeFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingLeft: 10,
        paddingRight: 4,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    activeFilterText: {
        fontSize: 12,
        color: '#1976D2',
        fontWeight: '600',
    },
});
