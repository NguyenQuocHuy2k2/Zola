import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import notificationService, { NotificationResponse } from '@/services/notification.service';
import { useNotification } from '@/contexts/NotificationContext';
import { NotificationItem } from '@/components/notification/notification-item';
import { NotificationHeader } from '@/components/notification/notification-header';
import { EmptyNotification } from '@/components/notification/empty-notification';

export default function NotificationScreen() {
    const theme = useTheme();
    const { refreshUnreadCount, unreadCount } = useNotification();
    const prevUnreadCountRef = useRef(unreadCount);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async (isRefreshing = false) => {
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
    
    // Auto-refresh notifications when unreadCount increases (polling detected new notifications)
    useEffect(() => {
        if (unreadCount > prevUnreadCountRef.current) {
            fetchNotifications(true);
        }
        prevUnreadCountRef.current = unreadCount;
    }, [unreadCount, fetchNotifications]);

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
            <NotificationHeader 
                title="Thông báo" 
                onMarkAllAsRead={handleMarkAllAsRead} 
            />

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </View>
            ) : notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={({ item }) => (
                        <NotificationItem item={item} onPress={handleMarkAsRead} />
                    )}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchNotifications(true)}
                            colors={[theme.colors.primary]}
                        />
                    }
                />
            ) : (
                <EmptyNotification 
                    title="Chưa có thông báo nào" 
                    subtitle="Thông báo về đơn hàng và ưu đãi sẽ xuất hiện tại đây." 
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});