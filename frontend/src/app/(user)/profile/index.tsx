import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, useTheme, List, Divider, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import ConfirmModal from '@/components/ui/confirm-modal';
import { orderService, Order, OrderStatus } from '@/services/order.service';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});

    useFocusEffect(
        useCallback(() => {
            orderService.getOrderHistory().then(orders => {
                const counts: Record<string, number> = {};
                orders.forEach(o => {
                    if (o.status === 'RECEIVED') {
                        // For 'Đánh giá', only count if there's at least one item not yet reviewed
                        const needsReview = o.items.some(item => !item.reviewed);
                        if (needsReview) {
                            counts['RECEIVED'] = (counts['RECEIVED'] || 0) + 1;
                        }
                    } else {
                        counts[o.status] = (counts[o.status] || 0) + 1;
                    }
                });
                setOrderCounts(counts);
            });
        }, [])
    );

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
                        title="Kho voucher"
                        titleStyle={styles.listItemTitle}
                        left={(props) => <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="#1D1D1D" style={styles.listIcon} />}
                        right={(props) => <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" style={styles.listChevron} />}
                        onPress={() => router.push('/profile/vouchers')}
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

                    {/* Order Quick-Access */}
                    <View style={styles.orderShortcuts}>
                        {[
                            { label: 'Đang chờ',  status: 'PENDING',   icon: 'clock-outline',          color: '#F59E0B' },
                            { label: 'Xác nhận',  status: 'CONFIRMED', icon: 'check-circle-outline',    color: '#3B82F6' },
                            { label: 'Đang Giao', status: 'SHIPPING',  icon: 'truck-fast-outline',      color: '#8B5CF6' },
                            { label: 'Đánh giá',  status: 'RECEIVED',  icon: 'star-outline',            color: '#F59E0B' },
                        ].map(item => (
                            <TouchableOpacity
                                key={item.status}
                                style={styles.orderShortcutItem}
                                activeOpacity={0.7}
                                onPress={() => router.push(`/orders?status=${item.status}&from=profile`)}
                            >
                                <View style={styles.orderShortcutIconWrapper}>
                                    <View style={[styles.orderShortcutIcon, { backgroundColor: item.color + '18' }]}>
                                        <MaterialCommunityIcons name={item.icon as any} size={26} color={item.color} />
                                    </View>
                                    {(orderCounts[item.status] ?? 0) > 0 && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>
                                                {orderCounts[item.status] > 99 ? '99+' : orderCounts[item.status]}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.orderShortcutLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Divider style={styles.divider} />

                    <List.Item
                        title="Liên hệ với Shop"
                        titleStyle={styles.listItemTitle}
                        left={(props) => <MaterialCommunityIcons name="facebook-messenger" size={24} color="#1D1D1D" style={styles.listIcon} />}
                        right={(props) => <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" style={styles.listChevron} />}
                        onPress={() => router.push('/profile/chat')}
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
    },
    orderShortcuts: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 16,
        gap: 8,
    },
    orderShortcutItem: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    orderShortcutIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderShortcutLabel: {
        fontSize: 11,
        color: '#444',
        fontWeight: '500',
        textAlign: 'center',
    },
    orderShortcutIconWrapper: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
