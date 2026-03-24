import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ImageGalleryProps {
    visible: boolean;
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ visible, images, initialIndex, onClose }) => {
    const screenWidth = Dimensions.get('window').width;

    if (!images || images.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
        >
            <SafeAreaView style={styles.galleryContainer}>
                <TouchableOpacity 
                    style={styles.galleryClose}
                    onPress={onClose}
                >
                    <MaterialCommunityIcons name="close" size={30} color="#fff" />
                </TouchableOpacity>
                
                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    initialScrollIndex={initialIndex}
                    getItemLayout={(_, index) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => (
                        <View style={{ width: screenWidth, height: '100%', justifyContent: 'center' }}>
                            <Image 
                                source={{ uri: item }} 
                                style={{ width: '100%', height: '80%' }} 
                                resizeMode="contain" 
                            />
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    galleryContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
    },
    galleryClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
});
