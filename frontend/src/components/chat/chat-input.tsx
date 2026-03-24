import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AttachmentType } from '@/services/chat.service';

interface ChatInputProps {
    onSend: (text: string, media: { uri: string, type: AttachmentType }[]) => Promise<void>;
    sending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, sending }) => {
    const theme = useTheme();
    const [inputText, setInputText] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<{ uri: string, type: AttachmentType }[]>([]);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 0.7,
        });

        if (!result.canceled && result.assets) {
            const newMedia = result.assets.map(asset => ({
                uri: asset.uri,
                type: AttachmentType.IMAGE
            }));
            setSelectedMedia(prev => [...prev, ...newMedia]);
        }
    };

    const removeMedia = (index: number) => {
        setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendPress = async () => {
        if (!inputText.trim() && selectedMedia.length === 0) return;
        
        const text = inputText;
        const media = [...selectedMedia];
        
        // Clear local state immediately for better UX
        setInputText('');
        setSelectedMedia([]);
        
        try {
            await onSend(text, media);
        } catch (error) {
            // Restore state if failed
            setInputText(text);
            setSelectedMedia(media);
            console.error('Failed to send in ChatInput:', error);
        }
    };

    return (
        <View style={styles.container}>
            {selectedMedia.length > 0 && (
                <View style={styles.previewContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.previewScroll}
                    >
                        {selectedMedia.map((item, index) => (
                            <View key={`${item.uri}-${index}`} style={styles.previewItem}>
                                <Image source={{ uri: item.uri }} style={styles.previewImage} />
                                <TouchableOpacity style={styles.removeBtn} onPress={() => removeMedia(index)}>
                                    <MaterialCommunityIcons name="close-circle" size={20} color="#FF5252" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
            
            <View style={styles.inputContainer}>
                <IconButton 
                    icon="image-outline" 
                    size={24} 
                    onPress={handlePickImage} 
                    disabled={sending} 
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    editable={!sending}
                />
                {sending ? (
                    <ActivityIndicator 
                        size="small" 
                        color={theme.colors.primary} 
                        style={styles.loader} 
                    />
                ) : (
                    <IconButton
                        icon="send"
                        size={24}
                        iconColor={theme.colors.primary}
                        onPress={handleSendPress}
                        disabled={!inputText.trim() && selectedMedia.length === 0}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    loader: {
        marginHorizontal: 12,
    },
    previewContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    previewScroll: {
        paddingHorizontal: 16,
    },
    previewItem: {
        marginRight: 15,
        marginTop: 10,
        marginBottom: 5,
        position: 'relative',
    },
    previewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    removeBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});
