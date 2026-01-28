import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, useTheme, List, Divider, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import ConfirmModal from '@/components/ui/confirm-modal';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        signOut();
    };

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text>Vui lòng đăng nhập</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F9F9F9' }]} edges={['top', 'left', 'right']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Avatar.Image size={60} source={{ uri: user.avatarUrl || 'https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg' }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
                            <Text style={styles.email}>{user.email || user.phone}</Text>
                        </View>
                    </View>
                    <IconButton
                        icon="cog-outline"
                        size={24}
                        iconColor="#1D1D1D"
                        onPress={() => router.push('/profile/settings')}
                        style={styles.editIconBtn}
                    />
                </View>

                <View style={styles.menuCard}>

                    <List.Item
                        title="Quản lý địa chỉ"
                        titleStyle={styles.listItemTitle}
                        left={(props) => <MaterialCommunityIcons name="map-marker-outline" size={24} color="#1D1D1D" style={styles.listIcon} />}
                        right={(props) => <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" style={styles.listChevron} />}
                        onPress={() => router.push('/profile/address')}
                        style={styles.listItem}
                    />
                    <Divider style={styles.divider} />

                    <List.Item
                        title="Sản phẩm yêu thích"
                        titleStyle={styles.listItemTitle}
                        left={(props) => <MaterialCommunityIcons name="heart-outline" size={24} color="#1D1D1D" style={styles.listIcon} />}
                        right={(props) => <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" style={styles.listChevron} />}
                        onPress={() => router.push('/profile/favorites')}
                        style={styles.listItem}
                    />
                    <Divider style={styles.divider} />

                    <List.Item
                        title="Đổi mật khẩu"
                        titleStyle={styles.listItemTitle}
                        left={(props) => <MaterialCommunityIcons name="key-outline" size={24} color="#1D1D1D" style={styles.listIcon} />}
                        right={(props) => <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" style={styles.listChevron} />}
                        onPress={() => router.push('/profile/change-password')}
                        style={styles.listItem}
                    />
                    <Divider style={styles.divider} />

                    {/* Logout moved inside the card, matched design */}
                    <List.Item
                        title="Đăng xuất"
                        titleStyle={[styles.listItemTitle, { color: '#e41212ff' }]}
                        left={(props) => <MaterialCommunityIcons name="logout-variant" size={24} color="#f60404ff" style={styles.listIcon} />}
                        onPress={handleLogout}
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                    />
                </View>
            </ScrollView>

            <ConfirmModal
                visible={logoutModalVisible}
                title="Đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?"
                confirmLabel="Đăng xuất"
                confirmColor="#FF5252"
                icon="logout-variant"
                onConfirm={confirmLogout}
                onCancel={() => setLogoutModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Add flex to allow the right side to push the icon
    },
    avatar: {
        backgroundColor: '#EAEAEA',
    },
    userInfo: {
        marginLeft: 16,
        justifyContent: 'center',
        flex: 1, // ensure text doesn't overflow
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#1D1D1D',
    },
    email: {
        marginTop: 2,
        color: '#777777',
        fontSize: 14,
    },
    editIconBtn: {
        margin: 0,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    listItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    listItemTitle: {
        fontSize: 16,
        color: '#1D1D1D',
        marginLeft: 8,
        fontWeight: '500',
    },
    listIcon: {
        marginRight: 8,
        alignSelf: 'center',
    },
    listChevron: {
        alignSelf: 'center',
    },
    divider: {
        backgroundColor: '#F0F0F0',
        height: 1,
        marginHorizontal: 16,
    }
});
