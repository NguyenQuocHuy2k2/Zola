import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button, IconButton, List, useTheme, Card } from 'react-native-paper';
import { Color, getColors, createColor, updateColor, deleteColor } from '../../../services/attributes/attribute-service';

export const ColorManager = () => {
    const [colors, setColors] = useState<Color[]>([]);
    const [name, setName] = useState('');
    const [hexCode, setHexCode] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const theme = useTheme();

    const loadData = async () => {
        try {
            const data = await getColors();
            setColors(data);
        } catch (error) {
            console.error('Failed to load colors', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!name.trim() || !hexCode.trim()) return;
        try {
            if (editingId) {
                await updateColor(editingId, { name, hexCode });
            } else {
                await createColor({ name, hexCode });
            }
            setName('');
            setHexCode('');
            setEditingId(null);
            loadData();
        } catch (error) {
            console.error('Failed to save color', error);
        }
    };

    const handleEdit = (color: Color) => {
        setName(color.name);
        setHexCode(color.hexCode);
        setEditingId(color.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteColor(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete color', error);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.formCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>{editingId ? 'Sửa màu sắc' : 'Thêm mới màu sắc'}</Text>
                    <TextInput 
                        label="Tên màu (VD: Đen)" 
                        value={name} 
                        onChangeText={setName} 
                        mode="outlined" 
                        style={styles.input} 
                    />
                    <TextInput 
                        label="Mã Hex Code (VD: #000000)" 
                        value={hexCode} 
                        onChangeText={setHexCode} 
                        mode="outlined" 
                        style={styles.input} 
                    />
                    <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                        {editingId ? 'Cập nhật' : 'Thêm'}
                    </Button>
                    {editingId && (
                        <Button mode="text" onPress={() => { setEditingId(null); setName(''); setHexCode(''); }}>Hủy</Button>
                    )}
                </Card.Content>
            </Card>

            <FlatList
                data={colors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={item.hexCode}
                        left={props => (
                            <View style={styles.colorIndicatorContainer}>
                                <View style={[styles.colorIndicator, { backgroundColor: item.hexCode }]} />
                            </View>
                        )}
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
    colorIndicatorContainer: { justifyContent: 'center', paddingLeft: 8 },
    colorIndicator: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#ccc' },
});
