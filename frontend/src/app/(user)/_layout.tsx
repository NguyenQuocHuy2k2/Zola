import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const theme = useTheme();
    const segments = useSegments();

    // Hide the tab bar when inside nested profile screens or product detail/category/search screens
    const hideTabBar =
        (segments[1] === 'profile' && segments.length > 3) ||
        (segments[1] === 'product' && segments.length > 3);
    const tabBarStyle = hideTabBar ? { display: 'none' as const } : undefined;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                headerShown: false,
                tabBarStyle,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="product"
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Giỏ hàng',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cart" size={24} color={color} />,
                    popToTopOnBlur: true,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Đơn hàng',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Thông báo',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Tài khoản',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
                    popToTopOnBlur: true,
                }}
            />
        </Tabs>
    );
}
