import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { SearchHistory } from '@/services/product.service';

interface SearchHistoryListProps {
    history: SearchHistory[];
    onSearch: (keyword: string) => void;
    onDeleteHistory: (id: number) => void;
    onClearHistory: () => void;
}

export const SearchHistoryList: React.FC<SearchHistoryListProps> = ({
    history,
    onSearch,
    onDeleteHistory,
    onClearHistory,
}) => {
    if (history.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>Recent Searches</Text>
                <IconButton icon="delete-outline" iconColor="#666" size={20} onPress={onClearHistory} />
            </View>
            <View style={styles.chipsContainer}>
                {history.map(item => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.historyChip}
                        onPress={() => onSearch(item.keyword)}
                    >
                        <Text style={styles.chipText}>{item.keyword}</Text>
                        <IconButton 
                            icon="close" 
                            size={14} 
                            iconColor="#888" 
                            style={styles.deleteIcon} 
                            onPress={() => onDeleteHistory(item.id)} 
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        color: '#666',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    historyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingLeft: 12,
        paddingRight: 8,
        paddingVertical: 6,
    },
    chipText: {
        color: '#444',
    },
    deleteIcon: {
        margin: 0,
        marginLeft: 4,
        width: 16,
        height: 16,
    },
});
