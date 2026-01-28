import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="change-password/index" />
            <Stack.Screen name="favorites/index" />
            <Stack.Screen name="address/index" />
            <Stack.Screen name="address/form/index" />
        </Stack>
    );
}
