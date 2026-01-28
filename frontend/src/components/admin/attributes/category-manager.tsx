import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button, IconButton, List, useTheme, Card } from 'react-native-paper';
import { Category, getCategories, createCategory, updateCategory, deleteCategory } from '../../../services/attributes/attribute-service';

export const CategoryManager = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const theme = useTheme();

    const loadData = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        try {
            if (editingId) {
                await updateCategory(editingId, { name, description });
            } else {
                await createCategory({ name, description });
            }
            setName('');
            setDescription('');
            setEditingId(null);
            loadData();
        } catch (error) {
            console.error('Failed to save category', error);
        }
    };

    const handleEdit = (category: Category) => {
        setName(category.name);
        setDescription(category.description);
        setEditingId(category.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete category', error);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.formCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>{editingId ? 'Sửa danh mục' : 'Thêm mới danh mục'}</Text>
                    <TextInput 
                        label="Tên danh mục" 
                        value={name} 
                        onChangeText={setName} 
                        mode="outlined" 
                        style={styles.input} 
                    />
                    <TextInput 
                        label="Mô tả" 
                        value={description} 
                        onChangeText={setDescription} 
                        mode="outlined" 
                        style={styles.input} 
                    />
                    <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                        {editingId ? 'Cập nhật' : 'Thêm'}
                    </Button>
                    {editingId && (
                        <Button mode="text" onPress={() => { setEditingId(null); setName(''); setDescription(''); }}>Hủy</Button>
                    )}
                </Card.Content>
            </Card>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={item.description}
                        left={props => <List.Icon {...props} icon="shape-outline" />}
                        right={props => (
                            <View style={{ flexDirection: 'row' }}>
                                <IconButton icon="pencil" iconColor={theme.colors.primary} size={20} onPress={() => handleEdit(item)} />
                                <IconButton icon="delete" iconColor={theme.colors.error} size={20} onPress={() => handleDelete(item.id)} />
                            </View>
                        )}
                        style={styles.listItem}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { marginBottom: 12, fontWeight: 'bold' },
    formCard: { marginBottom: 16 },
    input: { marginBottom: 12 },
    button: { marginTop: 8 },
    listItem: { backgroundColor: 'white', marginBottom: 8, borderRadius: 8 },
});
