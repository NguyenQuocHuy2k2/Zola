import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, useTheme, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addressService, AddressRequest } from '@/services/address.service';

export default function AddressFormScreen() {
    const router = useRouter();
    const theme = useTheme();
    const { addressId } = useLocalSearchParams<{ addressId?: string }>();
    const isEditing = !!addressId;

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadAddress();
        }
    }, [addressId]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAddress = async () => {
        try {
            const addresses = await addressService.getMyAddresses();
            const addr = addresses.find(a => a.id === addressId);
            if (addr) {
                setProvince(addr.province);
                setDistrict(addr.district);
                setWard(addr.ward);
                setStreetAddress(addr.streetAddress || '');
                setIsDefault(addr.isDefault);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setInitialLoading(false);
        }
    };

    const validate = () => {
        if (!province.trim()) return 'Vui lòng nhập tỉnh/thành phố.';
        if (!district.trim()) return 'Vui lòng nhập quận/huyện.';
        if (!ward.trim()) return 'Vui lòng nhập phường/xã.';
        return '';
    };

    const handleSave = async () => {
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
        setError('');
        setSaving(true);

        const payload: AddressRequest = {
            province: province.trim(),
            district: district.trim(),
            ward: ward.trim(),
            streetAddress: streetAddress.trim() || undefined,
            isDefault,
        };

        try {
            if (isEditing && addressId) {
                await addressService.updateAddress(addressId, payload);
            } else {
                await addressService.addAddress(payload);
            }
            router.back();
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1D1D1D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </Text>
                <View style={styles.backBtn} />
            </View>

            {initialLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Section: Địa chỉ */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>

                            <View style={styles.fieldWrapper}>
                                <Text style={styles.label}>Tỉnh / Thành phố *</Text>
                                <TextInput
                                    value={province}
                                    onChangeText={setProvince}
                                    placeholder="TP. Hồ Chí Minh"
                                    mode="flat"
                                    underlineColor="#EAEAEA"
                                    activeUnderlineColor={theme.colors.primary}
                                    style={styles.input}
                                    dense
                                />
                            </View>

                            <View style={styles.fieldWrapper}>
                                <Text style={styles.label}>Quận / Huyện *</Text>
                                <TextInput
                                    value={district}
                                    onChangeText={setDistrict}
                                    placeholder="Quận 1"
                                    mode="flat"
                                    underlineColor="#EAEAEA"
                                    activeUnderlineColor={theme.colors.primary}
                                    style={styles.input}
                                    dense
                                />
                            </View>

                            <View style={styles.fieldWrapper}>
                                <Text style={styles.label}>Phường / Xã *</Text>
                                <TextInput
                                    value={ward}
                                    onChangeText={setWard}
                                    placeholder="Phường Bến Nghé"
                                    mode="flat"
                                    underlineColor="#EAEAEA"
                                    activeUnderlineColor={theme.colors.primary}
                                    style={styles.input}
                                    dense
                                />
                            </View>

                            <View style={styles.fieldWrapper}>
                                <Text style={styles.label}>Địa chỉ cụ thể</Text>
                                <TextInput
                                    value={streetAddress}
                                    onChangeText={setStreetAddress}
                                    placeholder="Số nhà, tên đường..."
                                    mode="flat"
                                    underlineColor="#EAEAEA"
                                    activeUnderlineColor={theme.colors.primary}
                                    style={styles.input}
                                    dense
                                />
                            </View>
                        </View>

                        {/* Default toggle */}
                        <View style={styles.defaultRow}>
                            <View style={styles.defaultRowLeft}>
                                <MaterialCommunityIcons name="star-outline" size={20} color="#555" style={{ marginRight: 10 }} />
                                <View>
                                    <Text style={styles.defaultLabel}>Đặt làm địa chỉ mặc định</Text>
                                    <Text style={styles.defaultSubLabel}>Dùng cho đơn hàng tiếp theo</Text>
                                </View>
                            </View>
                            <Switch
                                value={isDefault}
                                onValueChange={setIsDefault}
                                trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '66' }}
                                thumbColor={isDefault ? theme.colors.primary : '#BDBDBD'}
                            />
                        </View>

                        {/* Error */}
                        {!!error && (
                            <View style={styles.errorBox}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#E53935" style={{ marginRight: 6 }} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Save button */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: theme.colors.primary }, saving && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={saving}
                            activeOpacity={0.85}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.saveBtnText}>
                                    {isEditing ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1D1D1D',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 24,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    fieldWrapper: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 2,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'transparent',
        fontSize: 15,
        paddingHorizontal: 0,
    },
    defaultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    defaultRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    defaultLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1D1D1D',
    },
    defaultSubLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    errorText: {
        color: '#E53935',
        fontSize: 13,
        flex: 1,
    },
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    saveBtn: {
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
