import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { chatService, ChatMessage, ChatRoom, AttachmentType } from '@/services/chat.service';
import { useAuth } from '@/contexts/AuthContext';

// Modular Components reused from user side
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageItem } from '@/components/chat/chat-message-item';
import { ChatInput } from '@/components/chat/chat-input';
import { ImageGallery } from '@/components/chat/image-gallery';

import { useChatSocket } from '@/hooks/use-chat-socket';

export default function AdminChatDetailScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const isFocused = useIsFocused();
    const theme = useTheme();
    
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Gallery state
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const { isConnected, messages: socketMessages, setMessages: setSocketMessages } = useChatSocket(id, isFocused);
    
    // Sync socket messages with component state
    useEffect(() => {
        setMessages(prev => {
            let updated = [...prev];
            let changed = false;
            for (const sm of socketMessages) {
                const idx = updated.findIndex(m => m.id === sm.id);
                if (idx !== -1) {
                    if (updated[idx].isRead !== sm.isRead) {
                        updated[idx] = { ...updated[idx], isRead: sm.isRead };
                        changed = true;
                    }
                } else {
                    updated.unshift(sm);
                    changed = true;
                }
            }
            return changed ? updated : prev;
        });
    }, [socketMessages]);

    const initRoom = useCallback(async () => {
        if (!id) return;
        try {
            // Find the room from list first or we could have a getRoomById API
            const allRooms = await chatService.getRooms();
            const currentRoom = allRooms.find(r => r.id === id);
            if (currentRoom) {
                setRoom(currentRoom);
                const history = await chatService.getMessages(id);
                setMessages([...history].reverse());
            } else {
                console.error('Room not found:', id);
            }
        } catch (error) {
            console.error('Failed to init admin chat room:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        initRoom();
    }, [initRoom]);

    const handleSend = async (text: string, media: { uri: string, type: AttachmentType }[]) => {
        if (!id) return;

        setSending(true);
        try {
            let attachments = undefined;
            if (media.length > 0) {
                const uploadPromises = media.map(m => chatService.uploadMedia(m.uri));
                const urls = await Promise.all(uploadPromises);
                attachments = urls.map(url => ({ url, type: AttachmentType.IMAGE }));
            }

            const newMessage = await chatService.sendMessage(id, text.trim(), attachments);
            setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id)) return prev;
                return [newMessage, ...prev];
            });
        } catch (error) {
            console.error('Admin failed to send message:', error);
            throw error;
        } finally {
            setSending(false);
        }
    };

    const onImagePress = (images: string[], index: number) => {
        setGalleryImages(images);
        setGalleryIndex(index);
        setGalleryVisible(true);
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
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior="padding"
            >
            <ChatHeader room={room} onBack={() => router.push('/(admin)/chat')} />

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ChatMessageItem 
                        item={item} 
                        isMine={item.senderId === user?.id}
                        otherUserAvatar={room?.otherUserAvatar}
                        onImagePress={onImagePress}
                    />
                )}
                inverted
                contentContainerStyle={styles.messageList}
                showsVerticalScrollIndicator={false}
            />

            <ChatInput onSend={handleSend} sending={sending} />

            <ImageGallery 
                visible={galleryVisible}
                images={galleryImages}
                initialIndex={galleryIndex}
                onClose={() => setGalleryVisible(false)}
            />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageList: {
        paddingVertical: 16,
    },
});
