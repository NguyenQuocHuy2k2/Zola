import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme, Text } from 'react-native-paper';
import { CategoryManager } from '@/components/admin/attributes/category-manager';
import { SizeManager } from '@/components/admin/attributes/size-manager';
import { ColorManager } from '@/components/admin/attributes/color-manager';

const renderScene = SceneMap({
    category: CategoryManager,
    size: SizeManager,
    color: ColorManager,
});

export default function AttributeManagementScreen() {
    const layout = useWindowDimensions();
    const theme = useTheme();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'category', title: 'Danh Mục' },
        { key: 'size', title: 'Kích Cỡ' },
        { key: 'color', title: 'Màu Sắc' },
    ]);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.surface }}
            renderLabel={({ route, focused }: { route: any, focused: boolean, color: string }) => (
                <Text style={{ color: focused ? theme.colors.primary : theme.colors.onSurface, fontWeight: focused ? 'bold' : 'normal' }}>
                    {route.title}
                </Text>
            )}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>Quản Lý Thuộc Tính</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingTop: 48, // space for status bar
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontWeight: 'bold',
    },
});
