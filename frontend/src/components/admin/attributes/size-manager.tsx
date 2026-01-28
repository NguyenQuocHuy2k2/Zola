import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button, IconButton, List, useTheme, Card } from 'react-native-paper';
import { Size, getSizes, createSize, updateSize, deleteSize } from '../../../services/attributes/attribute-service';

export const SizeManager = () => {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const theme = useTheme();

    const loadData = async () => {
        try {
            const data = await getSizes();
            setSizes(data);
        } catch (error) {
            console.error('Failed to load sizes', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        try {
            if (editingId) {
                await updateSize(editingId, { name });
            } else {
                await createSize({ name });
            }
            setName('');
            setEditingId(null);
            loadData();
        } catch (error) {
            console.error('Failed to save size', error);
        }
    };

    const handleEdit = (size: Size) => {
        setName(size.name);
        setEditingId(size.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteSize(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete size', error);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.formCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>{editingId ? 'Sửa kích cỡ' : 'Thêm mới kích cỡ'}</Text>
                    <TextInput 
                        label="Tên kích cỡ (VD: S, M, L)" 
                        value={name} 
                        onChangeText={setName} 
                        mode="outlined" 
                        style={styles.input} 
                    />
                    <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                        {editingId ? 'Cập nhật' : 'Thêm'}
                    </Button>
                    {editingId && (
                        <Button mode="text" onPress={() => { setEditingId(null); setName(''); }}>Hủy</Button>
                    )}
                </Card.Content>
            </Card>

            <FlatList
                data={sizes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        left={props => <List.Icon {...props} icon="format-size" />}
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
