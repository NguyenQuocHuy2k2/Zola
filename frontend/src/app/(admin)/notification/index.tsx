import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import notificationService, { NotificationResponse } from '@/services/notification.service';
import { useNotification } from '@/contexts/NotificationContext';
import { NotificationItem } from '@/components/notification/notification-item';
import { NotificationHeader } from '@/components/notification/notification-header';
import { EmptyNotification } from '@/components/notification/empty-notification';

export default function AdminNotificationScreen() {
    const theme = useTheme();
    const { refreshUnreadCount } = useNotification();
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = React.useCallback(async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);

        try {
            const response = await notificationService.getUserNotifications(0, 50);
            setNotifications(response.content);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const onRefresh = () => {
        fetchNotifications(true);
        refreshUnreadCount();
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            refreshUnreadCount();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            refreshUnreadCount();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FAFAFA' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <NotificationHeader 
                title="Thông báo Admin" 
                onMarkAllAsRead={handleMarkAllAsRead} 
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={({ item }) => (
                        <NotificationItem item={item} onPress={handleMarkAsRead} />
                    )}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]} 
                        />
                    }
                    ListEmptyComponent={
                        <EmptyNotification 
                            title="Chưa có thông báo nào" 
                            subtitle="Các thông báo về đơn hàng mới sẽ xuất hiện tại đây." 
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 8,
    },
    divider: {
        height: 0.5,
        backgroundColor: '#EEE',
    },
});
