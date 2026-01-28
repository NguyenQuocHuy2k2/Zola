import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TABS } from '@/utils/order';

interface OrderStatusTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({ activeTab, onTabChange }) => {
    const theme = useTheme();

    return (
        <View style={styles.tabsContainer}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsListContent}
                data={TABS}
                keyExtractor={item => item.value}
                renderItem={({ item }) => {
                    const isActive = activeTab === item.value;
                    return (
                        <TouchableOpacity
                            onPress={() => onTabChange(item.value)}
                            style={[
                                styles.tabChip,
                                isActive
                                    ? { backgroundColor: theme.colors.primary }
                                    : { backgroundColor: '#F0F0F0' },
                            ]}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name={item.icon as any}
                                size={15}
                                color={isActive ? '#FFFFFF' : '#666'}
                                style={{ marginRight: 5 }}
                            />
                            <Text style={isActive ? styles.activeTabText : styles.inactiveTabText}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        paddingVertical: 12,
        backgroundColor: '#FAFAFA',
        zIndex: 1,
    },
    tabsListContent: {
        paddingHorizontal: 16,
    },
    tabChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
    },
    activeTabText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    inactiveTabText: {
        color: '#666666',
    },
});

export default OrderStatusTabs;
