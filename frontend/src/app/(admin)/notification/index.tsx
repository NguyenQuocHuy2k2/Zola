import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Divider, Appbar, IconButton } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import notificationService, { NotificationResponse, NotificationType } from '@/services/notification.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotification } from '@/contexts/NotificationContext';

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

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.ORDER:
                return 'clipboard-list-outline';
            case NotificationType.PROMOTION:
                return 'tag-outline';
            case NotificationType.SYSTEM:
                return 'cog-outline';
            default:
                return 'bell-outline';
        }
    };

    const getIconColor = (type: NotificationType) => {
        switch (type) {
            case NotificationType.ORDER:
                return '#2196F3';
            case NotificationType.PROMOTION:
                return '#F44336';
            case NotificationType.SYSTEM:
                return '#9E9E9E';
            default:
                return theme.colors.primary;
        }
    };

    const renderItem = ({ item }: { item: NotificationResponse }) => (
        <TouchableOpacity 
            style={[styles.notificationItem, !item.read && styles.unreadItem]} 
            onPress={() => handleMarkAsRead(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(item.type)}15` }]}>
                <MaterialCommunityIcons name={getIcon(item.type)} size={24} color={getIconColor(item.type)} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.time}>
                    {format(new Date(item.createdAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FAFAFA' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thông báo Admin</Text>
                <IconButton
                    icon="check-all"
                    size={22}
                    iconColor={theme.colors.primary}
                    onPress={handleMarkAllAsRead}
                />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
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
                        <View style={styles.emptyContainer}>
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name="bell-off-outline" size={48} color="#CCC" />
                            </View>
                            <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
                            <Text style={styles.emptySubtitle}>
                                Các thông báo về đơn hàng mới sẽ xuất hiện tại đây.
                            </Text>
                        </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 8,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#F0F7FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1D1D',
        flex: 1,
    },
    unreadText: {
        fontWeight: 'bold',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196F3',
        marginLeft: 8,
    },
    message: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    divider: {
        height: 0.5,
        backgroundColor: '#EEE',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 100,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
    },
});
