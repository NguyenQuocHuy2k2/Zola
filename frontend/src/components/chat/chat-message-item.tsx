import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { ChatMessage, ChatMessageAttachment, AttachmentType } from '@/services/chat.service';

interface ChatMessageItemProps {
    item: ChatMessage;
    isMine: boolean;
    otherUserAvatar?: string;
    onImagePress: (images: string[], index: number) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ 
    item, 
    isMine, 
    otherUserAvatar, 
    onImagePress 
}) => {
    
    const renderAttachments = (attachments: ChatMessageAttachment[]) => {
        if (!attachments || attachments.length === 0) return null;

        const imageUrls = attachments
            .filter(a => a.type === AttachmentType.IMAGE)
            .map(a => a.url);

        if (imageUrls.length === 0) return null;

        const handlePress = (index: number) => {
            onImagePress(imageUrls, index);
        };

        if (imageUrls.length === 1) {
            return (
                <TouchableOpacity 
                    onPress={() => handlePress(0)}
                    style={styles.attachmentSingle}
                >
                    <Image source={{ uri: imageUrls[0] }} style={styles.imageSingle} resizeMode="cover" />
                </TouchableOpacity>
            );
        }

        const displayImages = imageUrls.slice(0, 3);
        
        return (
            <TouchableOpacity 
                onPress={() => handlePress(0)}
                style={styles.stackContainer}
                activeOpacity={0.9}
            >
                {displayImages.map((url, index) => {
                    const reverseIndex = displayImages.length - 1 - index;
                    const imageUrl = displayImages[reverseIndex];
                    
                    return (
                        <View 
                            key={`${imageUrl}-${reverseIndex}`}
                            style={[
                                styles.stackItem,
                                {
                                    transform: [
                                        { rotate: `${(reverseIndex) * 2}deg` },
                                        { translateX: reverseIndex * 4 },
                                        { translateY: reverseIndex * 2 }
                                    ],
                                    zIndex: 10 - reverseIndex,
                                    position: reverseIndex === 0 ? 'relative' : 'absolute',
                                    top: 0,
                                    left: 0,
                                }
                            ]}
                        >
                            <Image source={{ uri: imageUrl }} style={styles.stackImage} resizeMode="cover" />
                            {reverseIndex === 0 && imageUrls.length > 3 && (
                                <View style={styles.stackCountOverlay}>
                                    <Text style={styles.stackCountText}>+{imageUrls.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.messageWrapper, isMine ? styles.myMessage : styles.otherMessage]}>
            {!isMine && (
                <Avatar.Image 
                    size={32} 
                    source={{ uri: otherUserAvatar || 'https://via.placeholder.com/32' }} 
                    style={styles.messageAvatar}
                />
            )}
            <View style={[styles.messageContentWrapper, isMine ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                {item.content ? (
                    <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.otherBubble]}>
                        <Text style={[styles.messageText, isMine ? styles.myText : styles.otherText]}>
                            {item.content}
                        </Text>
                    </View>
                ) : null}
                
                {renderAttachments(item.attachments)}

                <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageWrapper: {
        flexDirection: 'row',
        marginVertical: 8,
        paddingHorizontal: 16,
    },
    myMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    messageAvatar: {
        marginRight: 8,
    },
    messageContentWrapper: {
        maxWidth: '75%',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        marginBottom: 4,
    },
    myBubble: {
        backgroundColor: '#528F72',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    myText: {
        color: '#fff',
    },
    otherText: {
        color: '#333',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 2,
        opacity: 0.7,
    },
    attachmentSingle: {
        marginTop: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageSingle: {
        width: 200,
        height: 150,
    },
    stackContainer: {
        marginTop: 8,
        paddingRight: 15,
        paddingBottom: 10,
    },
    stackItem: {
        width: 180,
        height: 130,
        borderRadius: 12,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    stackImage: {
        width: '100%',
        height: '100%',
    },
    stackCountOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stackCountText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
