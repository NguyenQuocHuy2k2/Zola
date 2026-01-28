import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';

export const ProductSearchBar = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => router.push('/product/search')}
      activeOpacity={0.8}
    >
      <IconButton icon="magnify" size={20} iconColor="#666" style={{ margin: 0, marginRight: 4 }} />
      <Text style={{ color: '#888', fontSize: 15 }}>Tìm kiếm sản phẩm...</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
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
  },
});
