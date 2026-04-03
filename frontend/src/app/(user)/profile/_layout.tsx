import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { GuestPlaceholder } from '@/components/auth/guest-placeholder';

export default function ProfileLayout() {
    const { user } = useAuth();

    if (!user) {
        return (
            <GuestPlaceholder
                title="Tài khoản cá nhân"
                description="Vui lòng đăng nhập để xem thông tin tài khoản, sổ địa chỉ và ưu đãi của bạn."
            />
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="change-password/index" />
            <Stack.Screen name="favorites/index" />
            <Stack.Screen name="chat/index" />
            <Stack.Screen name="address/index" />
            <Stack.Screen name="address/form/index" />
        </Stack>
    );
}
