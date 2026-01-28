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
        name="products/index"
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="package-variant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feedbacks/index"
        options={{
          title: 'Phản hồi',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="message-draw" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="attributes/index"
        options={{
          title: 'Thuộc tính',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="tune" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="product-form/index"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="order/[id]/index"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

