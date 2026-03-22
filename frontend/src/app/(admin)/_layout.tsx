import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="dashboard/index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-dashboard" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Sản phẩm',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="package-variant" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Đơn hàng',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-list" size={24} color={color} />,
                }}
            />
            {/* Hidden sub-pages to silence warnings */}
            <Tabs.Screen name="products/index" options={{ href: null }} />
            <Tabs.Screen name="products/create/index" options={{ href: null }} />
            <Tabs.Screen name="products/[id]/index" options={{ href: null }} />
            <Tabs.Screen name="products/[id]/variant/index" options={{ href: null }} />
            <Tabs.Screen name="orders/index" options={{ href: null }} />
            <Tabs.Screen name="index" options={{ href: null }} />
        </Tabs>
    );
}
