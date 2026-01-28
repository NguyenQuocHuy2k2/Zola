import React from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface SearchHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: (query: string) => void;
    onClear: () => void;
    onFilterPress: () => void;
    isInputFocused: boolean;
    setIsInputFocused: (focused: boolean) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onSearch,
    onClear,
    onFilterPress,
    isInputFocused,
    setIsInputFocused,
}) => {
    const router = useRouter();

    const handleSearchSubmit = () => {
        if (searchQuery.trim() === '') return;
        onSearch(searchQuery);
    };

    return (
        <View style={styles.header}>
            <IconButton 
                icon="arrow-left" 
                iconColor="#1E1E1E" 
                onPress={() => router.back()} 
                style={{ marginLeft: 8 }} 
            />
            <View style={styles.searchBarContainer}>
                <IconButton 
                    icon="magnify" 
                    size={20} 
                    iconColor="#666" 
                    style={{ margin: 0, marginRight: 4 }}
                    onPress={handleSearchSubmit}
                />
                <TextInput
                    placeholder="Tìm kiếm sản phẩm..."
                    placeholderTextColor="#888"
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                    value={searchQuery}
                    style={styles.searchInput}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    autoFocus
                />
                {searchQuery.length > 0 && (
                    <IconButton
                        icon="close-circle"
                        size={18}
                        iconColor="#ccc"
                        onPress={onClear}
                        style={{ margin: 0 }}
                    />
                )}
            </View>
            {isInputFocused ? (
                <IconButton 
                    icon="magnify"
                    onPress={handleSearchSubmit}
                />
            ) : (
                <IconButton icon="tune-variant" onPress={onFilterPress} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        minHeight: 44,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1E1E1E',
        padding: 0,
    },
});
