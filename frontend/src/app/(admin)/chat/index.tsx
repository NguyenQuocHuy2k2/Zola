import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { chatService, ChatRoom } from '@/services/chat.service';
import { ChatRoomItem } from '@/components/chat/chat-room-item';
import { useChatSocket } from '@/hooks/use-chat-socket';

export default function AdminChatListScreen() {
    const router = useRouter();
    const theme = useTheme();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { socket } = useChatSocket(); // Added useChatSocket hook

    const fetchRooms = useCallback(async () => {
        try {
            const data = await chatService.getRooms();
            // Sort by last message time (newest first)
            const sorted = data.sort((a, b) => 
                new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            );
            setRooms(sorted);
            setFilteredRooms(sorted);
        } catch (error) {
            console.error('Failed to fetch admin rooms:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (updatedRoom: ChatRoom) => {
            setRooms(prev => {
                const index = prev.findIndex(r => r.id === updatedRoom.id);
                let newRooms;
                if (index !== -1) {
                    newRooms = [...prev];
                    newRooms[index] = updatedRoom;
                } else {
                    newRooms = [updatedRoom, ...prev];
                }
                // Re-sort
                return newRooms.sort((a, b) => 
                    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
                );
            });
        };

        socket.on('update_chat_list', handleUpdate);
        return () => {
            socket.off('update_chat_list', handleUpdate);
        };
    }, [socket]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = rooms.filter(room => 
            (room.otherUserName && room.otherUserName.toLowerCase().includes(query)) || 
            (room.otherUserEmail && room.otherUserEmail.toLowerCase().includes(query)) ||
            (room.otherUserPhone && room.otherUserPhone.includes(query))
        );
        setFilteredRooms(filtered);
    }, [searchQuery, rooms]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRooms();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>Tin nhắn khách hàng</Text>
            </View>
            
            <Searchbar
                placeholder="Tìm tên, email hoặc SĐT..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
            />

            <FlatList
                data={filteredRooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatRoomItem 
                        room={item} 
                        onPress={() => router.push(`/(admin)/chat/room/${item.id}`)} 
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyLarge" style={{ color: '#666' }}>
                            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có cuộc hội thoại nào'}
                        </Text>
                    </View>
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={filteredRooms.length === 0 ? { flex: 1 } : undefined}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
    },
    searchBar: {
        margin: 12,
        backgroundColor: '#fff',
        elevation: 0,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
    },
    searchInput: {
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 80, 
    },
});
