import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, Avatar, Badge, useTheme } from 'react-native-paper';
import { ChatRoom } from '@/services/chat.service';

interface ChatRoomItemProps {
    room: ChatRoom;
    onPress: () => void;
}

export const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ room, onPress }) => {
    const theme = useTheme();

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Avatar.Image 
                size={50} 
                source={{ uri: room.otherUserAvatar || 'https://via.placeholder.com/50' }} 
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.userName}>{room.otherUserName}</Text>
                    <Text variant="bodySmall" style={styles.time}>{formatTime(room.lastMessageTime)}</Text>
                </View>
                <View style={styles.footer}>
                    <Text 
                        variant="bodyMedium" 
                        numberOfLines={1} 
                        style={[styles.lastMessage, room.unreadCount > 0 && styles.unreadText]}
                    >
                        {room.lastMessage || 'Chưa có tin nhắn'}
                    </Text>
                    {room.unreadCount > 0 && (
                        <Badge size={20} style={styles.badge}>{room.unreadCount}</Badge>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userName: {
        fontWeight: 'bold',
    },
    time: {
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    lastMessage: {
        flex: 1,
        color: '#666',
        marginRight: 8,
    },
    unreadText: {
        color: '#000',
        fontWeight: '500',
    },
    badge: {
        backgroundColor: '#FF5252',
    },
});
