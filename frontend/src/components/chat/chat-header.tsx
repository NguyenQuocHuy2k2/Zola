import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Avatar, useTheme } from 'react-native-paper';
import { ChatRoom } from '@/services/chat.service';

interface ChatHeaderProps {
    room: ChatRoom | null;
    onBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ room, onBack }) => {
    const theme = useTheme();

    return (
        <View style={styles.header}>
            <IconButton icon="arrow-left" size={24} onPress={onBack} />
            {room && (
                <View style={styles.headerTitle}>
                    <Avatar.Image 
                        size={40} 
                        source={{ uri: room.otherUserAvatar || 'https://via.placeholder.com/40' }} 
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.userName}>{room.otherUserName}</Text>
                    </View>
                </View>
            )}
            <IconButton icon="dots-vertical" size={24} onPress={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    headerText: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
