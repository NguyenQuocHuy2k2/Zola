import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationResponse, NotificationType } from '@/services/notification.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface NotificationItemProps {
    item: NotificationResponse;
    onPress: (id: number) => void;
}

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.ORDER:
            return { name: 'package-variant-closed', color: '#2196F3' };
        case NotificationType.PROMOTION:
            return { name: 'ticket-percent-outline', color: '#F44336' };
        case NotificationType.SYSTEM:
            return { name: 'shield-check-outline', color: '#4CAF50' };
        default:
            return { name: 'bell-outline', color: '#757575' };
    }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress }) => {
    const icon = getNotificationIcon(item.type);
    const formattedDate = format(new Date(item.createdAt), 'HH:mm, dd/MM/yyyy', { locale: vi });

    return (
        <TouchableOpacity 
            style={[styles.notificationItem, !item.read && styles.unreadItem]}
            onPress={() => onPress(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: icon.color + '15' }]}>
                <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.itemHeader}>
                    <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    notificationItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    unreadItem: {
        backgroundColor: '#f0f7ff',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#444',
        flex: 1,
    },
    unreadTitle: {
        fontWeight: 'bold',
        color: '#222',
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
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
});
